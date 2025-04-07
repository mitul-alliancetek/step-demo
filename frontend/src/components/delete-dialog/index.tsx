import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"

type DeleteDialogProps = {
    deleteConfirmOpen: boolean,
    handleDeleteCancel: () => void,
    handleDeleteConfirm: () => void
}

export function DeleteDialog({ deleteConfirmOpen, handleDeleteCancel, handleDeleteConfirm }: DeleteDialogProps) {

    return (<Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            Confirm Delete
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this document? This action cannot be undone.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                Delete
            </Button>
        </DialogActions>
    </Dialog>)
}

