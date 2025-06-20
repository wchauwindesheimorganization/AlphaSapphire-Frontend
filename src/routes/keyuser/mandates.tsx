import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "../../components/Datatable";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/UserContext";
import { mandatecolumns } from "@/models/Columndefinitions/MandateColumns";
import { Mandate } from "@/models/entities/Mandate";
import { createMandate, getMandates, updateMandate } from "@/api/mandateApi";
import GenericErrorSetter from "@/utils/GenericErrorSetter";
import GenericCancelAdd from "@/utils/GenericCancelAdd";
import { MandateValidation } from "@/models/Validationrules/Mandatevalidation";
import GenericAdd from "@/utils/GenericAdd";
import GenericStateUpdater from "@/utils/GenericStateUpdater";
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
    GenericStateUpdater({ setState: setMandates, id, updatedFields })
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
      GenericErrorSetter({ error, setErrors })
    }
  }
  const handleSaveNewMandate = async (newMandate: EditableMandate) => {
    try {
      const sanitizedMandate: EditableMandate = { ...newMandate };
      GenericAdd(MandateValidation, sanitizedMandate)


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
      GenericErrorSetter({ error, setErrors })
    }
  };

  const handleCancelNewMandate = (id: number) => {
    GenericCancelAdd(id, setMandates, setIsAdding);
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
          {errors?.map(({ errormessage, id }) => (
            <p key={id} style={{ color: "red " }}>
              {errormessage}
            </p>
          ))}
        </>
      )}
    </>
  );
}
