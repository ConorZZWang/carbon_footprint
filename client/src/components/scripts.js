import React from "react";
import ReactDOM from "react-dom";
import TextBox from "./TextBox";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";

// Export the function
export function scrollToEntry() {
  const target = document.getElementById("startMainDash");
  target.scrollIntoView({ behavior: "smooth" });
}


export function addFactorBox() {
    console.log("Button clicked");

    const container = document.getElementById("factorContainer");

    // Create a wrapper div for Handsontable
    const wrapper = document.createElement("div");
    wrapper.classList.add("factor-box-wrapper");
    container.prepend(wrapper);

    // Define Handsontable settings
    const hot = new Handsontable(wrapper, {
        data: [
            ["Carbon", 0]
        ],
        colHeaders: ["Factor", "Value"],
        columns: [
            {
                type: "dropdown",
                source: ["Carbon", "Water", "Energy"],
            },
            {
                type: "numeric",
                allowInvalid: false
            }
        ],
        width: "100%",
        height: "auto",
        licenseKey: "non-commercial-and-evaluation",
    });
}


