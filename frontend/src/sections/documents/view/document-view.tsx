import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import ApiHelper from 'src/utils/api';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from 'src/components/table/table-no-data';
import { TableEmptyRows } from 'src/components/table/table-empty-rows';
import { DeleteDialog } from 'src/components/delete-dialog';

import { emptyRows } from '../utils';
import { DocumentTableRow } from '../document-table-row';
import { DocumentTableHead } from '../document-table-head';
import { DocumentTableToolbar } from '../document-table-toolbar';

import type { DocumentProps } from '../document-table-row';
import { DocumentForm } from './document-form';




type PageInfo = {

  current_page: number
  data: DocumentProps[],
  first_page_url: string,
  from: number,
  last_page: number,
  last_page_url: string,
  links: string[],
  next_page_url: string | null,
  path: string,
  per_page: number,
  prev_page_url:
  string | null
  to: number
  total: number
}

export function DocumentView() {
  const table = useTable();
  const [pageData, setPageData] = useState<PageInfo | null>(null);
  const [searchText, setSearchText] = useState('');
  const { page, rowsPerPage, orderBy, order, setPage } = table
  const [formData, setFormData] = useState({
    isOpen: false,
    id: 0
  })
  const [deleteId, setDeleteId] = useState(0)
  useEffect(() => {
    getPageData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, orderBy, order, searchText]);


  const getPageData = async () => {
    try {
      const _documents: PageInfo = await ApiHelper.get(`/documents?page=${page}&per_page=${rowsPerPage}&order_by=${orderBy}&order_direction=${order}&search=${searchText}`);
      setPageData(_documents)
    } catch (e) {
      alert(e);
    }
  }

  const handleClose = (reload: boolean) => {
    setFormData({
      isOpen: false,
      id: 0,
    })
    if (reload) {
      getPageData();
    }
  }
  const onEditRow = (id: number) => {
    setFormData({
      isOpen: true,
      id
    })
  }
  const onDeleteRow = async (id: number) => {
    setDeleteId(id)
  }

  const handleDeleteConfirm = async () => {
    try {
      await ApiHelper.delete(`/documents/${deleteId}`);
      setDeleteId(0)
      getPageData()
    } catch (e) {
      alert(e);
    }
  }

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Documents
        </Typography>
        <Button
          onClick={() => setFormData({ isOpen: true, id: 0 })}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Document
        </Button>
      </Box>

      {pageData?.data ?
        <Card>
          <DocumentTableToolbar
            numSelected={table.selected.length}
            filterName={searchText}
            onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSearchText(event.target.value);
              table.onResetPage();
            }}
          />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <DocumentTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  rowCount={pageData?.total || 0}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  headLabel={[
                    { id: 'name', label: 'Name' },
                    { id: 'current_language', label: 'Original Language' },
                    { id: 'process_language', label: 'Convert Language' },
                    { id: 'status', label: 'Status' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {pageData?.data
                    .map((row) => (
                      <DocumentTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onEditRow={() => onEditRow(row.id)}
                        onDeleteRow={() => onDeleteRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={68}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, _users.length)}
                  />

                  {pageData?.data.length === 0 && <TableNoData searchQuery={searchText} />}
                </TableBody>
              </Table>
            </TableContainer>

          </Scrollbar>

          <TablePagination
            component="div"
            page={pageData.current_page - 1}
            count={pageData.total}
            rowsPerPage={pageData.per_page}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card> :
        <div>Loading</div>
      }
      <DocumentForm isOpen={formData.isOpen}
        id={formData.id}
        close={handleClose} />
      <DeleteDialog
        deleteConfirmOpen={deleteId !== 0}
        handleDeleteCancel={() => onDeleteRow(0)}
        handleDeleteConfirm={handleDeleteConfirm}
      />

    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(1); // Changed from 0 to 1
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<number[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: number[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: number) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(1); // Changed from 0 to 1
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage + 1);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    setPage,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
