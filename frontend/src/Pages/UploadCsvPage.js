import React, { Fragment, useState } from "react";
import Button from '@material-ui/core/Button';
import { importMarksUrl } from '../routes';

import 'bootstrap/dist/css/bootstrap.min.css';
import "../App.css";

export const UploadCsvPage = () => {
  const [submitting, setSubmitting] = useState(false);

  //Source: https://masakudamatsu.medium.com/how-to-customize-the-file-upload-button-in-react-b3866a5973d8
  // Create a reference to the hidden file input element
  const hiddenFileInput = React.useRef(null);

  // programatically click hidden file input element
  // when the Button is clicked
  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  // handle the user-selected file 
  const handleChange = async (event) => {
    // access to the file content
    let files = event.target.files;
    // access to file data
    let dataOutput = null;

    Array.from(files)
      .filter((file) => file.type === "application/vnd.ms-excel" || file.type === "text/csv")
      .forEach(async (file) => {
        dataOutput = await file.text();
        if (submitting === false) {
          setSubmitting(true);
          fetch(importMarksUrl + "5f8ed1b166ea0039a87b3bf3", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            // convert to JSON and send it as the PUT body
            body: JSON.stringify({ dataOutput }),
          })
            .then((res) => {
              if (res.ok) {
                //successful
                return res.json();
              }
            })
            .then((jsonData) => {
              console.warn(jsonData);
            })
            .catch((err) => {
              console.error("Upload error: " + err);
              setSubmitting(false);
            });
        }
      });
  };

  return (
    <Fragment>
      <h1>1 Function only: Upload CSV file with marks</h1>
      <Button
        onClick={handleClick}
        type="submit"
        variant="contained"
        color="primary">Import Marks</Button>

      <input type="file" name="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: 'none' }} />
    </Fragment>
  );
};