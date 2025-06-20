


export default function GenericStateUpdater<T extends { Id: number }>({ setState, id, updatedFields }: { setState: React.Dispatch<React.SetStateAction<T[]>>, id: number, updatedFields: Partial<T> }) {
    setState((prevState) =>
        prevState.map((entity) =>
            entity.Id === id ? { ...entity, ...updatedFields } : entity
        )
    );
};