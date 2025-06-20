export default function GenericCancelAdd<T extends { Id: number }>(id: number, setState: React.Dispatch<React.SetStateAction<T[]>>, setIsAdding: React.Dispatch<React.SetStateAction<boolean>>) {
    setState((prevState) => prevState.filter((state) => state.Id !== id));
    setIsAdding(false);
}