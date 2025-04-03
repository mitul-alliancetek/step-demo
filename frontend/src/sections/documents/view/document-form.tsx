/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTheme } from '@emotion/react';
import { useState, useEffect, useCallback } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Grid, Select, MenuItem, TextField, InputLabel, DialogTitle, DialogActions, DialogContent, Input, FormHelperText } from '@mui/material';

import ApiHelper from 'src/utils/api';

import { varAlpha } from 'src/theme/styles';

import type { DocumentProps } from '../document-table-row';

export type DocumentFormProps = {
  isOpen: boolean,
  id: number,
  close: (reload: boolean) => void
}

export function DocumentForm(formProps: DocumentFormProps) {
  const theme = useTheme();
  const { isOpen, id, close } = formProps;
  const [document, setDocument] = useState<DocumentProps | null>(null);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Document name is required'),
    document: id ? Yup.mixed().nullable() // Optional in edit mode
    : Yup.mixed().required('A file is required'),
    current_language: Yup.string().required('Current language is required'),
    process_language: Yup.string().required('Process language is required'),
    status: Yup.string().required('Status is required'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: '',
      document: null,
      current_language: '',
      process_language: '',
      status: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (value) formData.append(key, value as string | Blob);
        });
        
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };

        if (id) {
          await ApiHelper.post(`/documents/${id}`, formData, config);
        } else {
          await ApiHelper.post('/documents', formData, config);
        }
        close(true);
      } catch (error: any) {
        // Handle different types of errors
        if (error?.response?.data?.errors) {
          setErrors(error.response.data.errors)
        }else{
          alert("Please try again!!");
        }
        
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getPageData = useCallback(async () => {
    try {
      const _document: DocumentProps = await ApiHelper.get(`/documents/${id}`);
      setDocument(_document);
      // Populate form with existing data if editing
      if (_document) {
        formik.setValues({
          name: _document.name || '',
          document: null, // File input can't be pre-populated for security reasons
          current_language: _document.current_language || '',
          process_language: _document.process_language || '',
          status: _document.status || '',
        });
      }
    } catch (e) {
      alert(e);
    }
  }, [formik, id]);

  useEffect(() => {
    if (id) {
      getPageData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleClose = () => {
    formik.resetForm();
    close(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue('document', file);
    }
  };

  return (
    <Dialog
      maxWidth='md'
      fullWidth
      open={isOpen}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{id ? 'Edit Document' : 'Add New Document'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent style={{ paddingTop: 20 }}>
          <Grid container xs={12} rowGap={2}>
            <Grid xs={12} px={1}>
              <InputLabel>Document Name</InputLabel>
              <TextField
                fullWidth
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Document Name"
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid xs={12} md={6} px={1}>
              <InputLabel>Current Language</InputLabel>
              <Select
                fullWidth
                name="current_language"
                value={formik.values.current_language}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.current_language && Boolean(formik.errors.current_language)}
              >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Spanish">Spanish</MenuItem>
                <MenuItem value="French">French</MenuItem>
              </Select>
              {formik.touched.current_language && formik.errors.current_language && (
                <FormHelperText error>{formik.errors.current_language}</FormHelperText>
              )}
            </Grid>

            <Grid xs={12} md={6} px={1}>
              <InputLabel>Process Language</InputLabel>
              <Select
                fullWidth
                name="process_language"
                value={formik.values.process_language}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.process_language && Boolean(formik.errors.process_language)}
              >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Spanish">Spanish</MenuItem>
                <MenuItem value="French">French</MenuItem>
              </Select>
              {formik.touched.process_language && formik.errors.process_language && (
                <FormHelperText error>{formik.errors.process_language}</FormHelperText>
              )}
            </Grid>

            <Grid xs={12} md={6} px={1}>
              <InputLabel>Document File</InputLabel>
              <Input
                type="file"
                name="document"
                onChange={handleFileChange}
                onBlur={formik.handleBlur}
                error={formik.touched.document && Boolean(formik.errors.document)}
              />
              {formik.touched.document && formik.errors.document && (
                <FormHelperText error>{formik.errors.document}</FormHelperText>
              )}
            </Grid>

            <Grid xs={12} md={6} px={1}>
              <InputLabel>Status</InputLabel>
              <Select
                fullWidth
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.status && Boolean(formik.errors.status)}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
              {formik.touched.status && formik.errors.status && (
                <FormHelperText error>{formik.errors.status}</FormHelperText>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button type="submit" disabled={formik.isSubmitting}>
            {id ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}