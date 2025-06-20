import { Mandate } from "@/models/entities/Mandate"
import { OptionProps } from "react-select"
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function MultiselectTooltip({ data, innerProps, innerRef, isFocused }: Readonly<OptionProps<Mandate>>) {


    return (
        <div ref={innerRef} {...innerProps} data-tip={data.Description} data-tooltip-content={data.Description} data-tooltip-id={`tooltip-${data.Id}`}
            style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                cursor: "pointer",
                backgroundColor: isFocused ? "#f0f0f0" : "white",
                color: isFocused ? "#333" : "#555",

            }}>
            {data.MandateName}
            <ReactTooltip id={`tooltip-${data.Id}`} place="bottom"
                style={{
                    position: "fixed",
                    maxWidth: "20vw", // Limit the tooltip's width
                    whiteSpace: "normal", // Allow text to wrap
                    overflowWrap: "break-word", // Break long words
                }} />
        </div>
    )

}