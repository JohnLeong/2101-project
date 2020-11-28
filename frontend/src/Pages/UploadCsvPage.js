import React, { Fragment, useState } from "react";
import Button from '@material-ui/core/Button';

import ComponentUI from "../Boundaries/ComponentUI"
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
    await ComponentUI.displayFileDialog(event, [submitting, setSubmitting], "5f8ed1b166ea0039a87b3bf3");
  };

  return (
    <Fragment>
      <h1>1 Function only: Upload CSV file with marks</h1>
      <h2>HAVING A STATIC COMPONENT ID</h2>
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