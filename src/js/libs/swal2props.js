export const didOpen = () => {
    Swal.getConfirmButton()?.classList.add("bg-blue-400");
    Swal.getConfirmButton()?.classList.add("bg-blue-400");
};

export const deafultConfirmProps = {
    title: "Yakin ingin hapus Data?",
    text: "Data yang dihapus tidak bisa di kembalikan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, saya yakin!",
    cancelButtonText: "Batal",
    didOpen,
};

export const defaultErrorProps = {
    title: "Error",
    icon: "error",
    text: "Error",
    didOpen,
};

export const defaultSuccessProps = {
    title: "Selamat",
    icon: "success",
    text: "Success",
    didOpen,
};
