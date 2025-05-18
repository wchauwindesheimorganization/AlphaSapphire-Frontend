import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "../../components/Datatable";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/UserContext";
import { mandatecolumns } from "@/models/Columndefinitions/MandateColumns";
import { Mandate } from "@/models/entities/Mandate";
import { createMandate, getMandates, updateMandate } from "@/api/mandateApi";
export const Route = createFileRoute("/keyuser/mandates")({
  component: RouteComponent,
});

function RouteComponent() {
  type EditableMandate = Mandate & { isNew?: boolean };
  const userContext = useContext(UserContext);
  const account = userContext.account!;
  const [mandates, setMandates] = useState<Mandate[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [errors, setErrors] = useState<
    { id: number; errormessage: string }[] | null
  >();
  useEffect(() => {
    getMandates().then(data => setMandates(data));


  }, []);

  const updateMandateState = (id: number, updatedFields: Partial<Mandate>) => {
    setMandates((prevMandates) =>
      prevMandates.map((mandate) =>
        mandate.Id === id ? { ...mandate, ...updatedFields } : mandate
      )
    );
  };
  const handleAddRow = () => {
    setIsAdding(true);
    setMandates((prevMandates) => [
      ...prevMandates,
      {
        Id: 0,
        DepartmentId: account.DepartmentId!,
        MandateName: "",
        Description: "",
        isNew: true, // Flag to indicate this is a new row
      },
    ]);
  };
  const handlePatchMandate = async (id: number, mandate: Partial<Mandate>) => {
    try {

      await updateMandate(id, mandate);
      updateMandateState(id, mandate);
    }
    catch (error) {

      if (error instanceof Error && (error as any).response?.data) {
        const errorsWithId = (error as any).response?.data.map(
          (errormessage: string, id: number) => ({
            id: id,
            errormessage,
          })
        );
        setErrors(errorsWithId);
      } else {
        console.error("Unexpected error:", error);
        setErrors([{ errormessage: "An unexpected error occurred.", id: 1 }]);
      }
    }
  }
  const handleSaveNewMandate = async (newMandate: EditableMandate) => {
    try {
      const { isNew, ...sanitizedMandate } = newMandate;
      const mandateerrors = [];
      if (sanitizedMandate.MandateName === '') {
        mandateerrors.push("Mandate name is required");
      }
      if (sanitizedMandate.DepartmentId === null) {
        mandateerrors.push("Department Id is empty, contact app administrator");
      }
      if (mandateerrors.length > 0) {
        const error = new Error("An error occurred!") as Error & { response?: { data: Array<string> } };
        error.response = { data: mandateerrors };
        throw error;
      }
      const addedMandate = await createMandate(sanitizedMandate);

      setMandates((prevMandates) =>
        prevMandates.map((mandate) =>
          mandate.Id === newMandate.Id
            ? {
              ...addedMandate, isNew: false,
            }
            : mandate
        )
      );
      setIsAdding(false);
    } catch (error) {
      if (error instanceof Error && (error as any).response?.data) {
        const errorsWithId = (error as any).response?.data.map(
          (errormessage: string, id: number) => ({
            id: id,
            errormessage,
          })
        );
        setErrors(errorsWithId);
      } else {
        console.error("Unexpected error:", error);
        setErrors([{ errormessage: "An unexpected error occurred.", id: 1 }]);
      }
    }
  };

  const handleCancelNewMandate = (id: number) => {
    setMandates((prevMandates) => prevMandates.filter((mandate) => mandate.Id !== id));
    setIsAdding(false);
  };
  return (
    <>
      <h2>Mandates</h2>
      <button
        onClick={handleAddRow}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        disabled={isAdding}
      >
        Add New Mandate
      </button>
      {mandates && (
        <>
          <DataTable
            columns={mandatecolumns(
              updateMandateState,
              handleSaveNewMandate,
              handleCancelNewMandate,
              handlePatchMandate,
              mandates
            )}
            data={mandates}
          />
          {errors &&
            errors.map(({ errormessage, id }) => (
              <p key={id} style={{ color: "red " }}>
                {errormessage}
              </p>
            ))}
        </>
      )}
    </>
  );
}
