import React, { useState, useEffect } from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { Table } from 'reactstrap';
import "./form.css";

export default function SignUpForm() {
  const [formValues, setFormValues] = useState([]);
  const [singleFormValue,setSingleFormValue] = useState({});

  const getUserDetails = () => {
    fetch("https://61ea3a257bc0550017bc65e1.mockapi.io/users")
      .then((data) => data.json())
      .then((users) => setFormValues(users));
  };
  useEffect(() => {
    getUserDetails();
  }, []);
  console.log(formValues);
  const deleteHandler = (id) => {
    fetch(`https://61ea3a257bc0550017bc65e1.mockapi.io/users/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((data) => {
        data.json();
      })
      .then(() => getUserDetails());
  };

  const editHandler = (id) => {
    fetch(`https://61ea3a257bc0550017bc65e1.mockapi.io/users/${id}`)
    .then((data) => data.json())
    .then((users) => setSingleFormValue(users));
    
  };
  // const editHandler = (id) => {
  //   fetch(`https://61ea3a257bc0550017bc65e1.mockapi.io/users/${id}`)
  //     .then((data) => data.json())
  //     .then((users) => setValue(users));
  // };

  return (
    <><h1>Formik CRUD Operation</h1>
    <div className="container">      
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          radioGroup: "",
          email: "",
          mobileNumber: "",
          toggle: false,
          checked: [],
        }}
        validationSchema={Yup.object({
          firstName: Yup.string()
            .max(15, "Must be 15 characters or less")
            .required("Required"),
          lastName: Yup.string()
            .max(20, "Must be 20 characters or less")
            .required("Required"),
          radioGroup: Yup.string().required("A radio option is required"),
          email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
          mobileNumber: Yup.string()
            .required("Required")
            .matches(
              /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
              "Phone number is not valid"
            )
            .min(10, "to short")
            .max(10, "to long"),
          toggle: Yup.boolean()
            .required("Required")
            .oneOf([true], "You must accept the terms and conditions."),
        })}
        onSubmit={(values, { resetForm }) => {
          alert(JSON.stringify(values));
          fetch(`https://61ea3a257bc0550017bc65e1.mockapi.io/users`, {
            method: "POST",
            body: JSON.stringify(values),
            headers: { "Content-Type": "application/json" },
          })
            .then((data) => {
              data.json();
            })
            .then(() => getUserDetails());
          // setFormValues([values]);
          console.log(formValues);
          resetForm();
        }}
      
    
      >
        <Form className="form">
          <label htmlFor="firstName">First Name</label>
          <Field id="firstName" type="text" name="firstName" value={singleFormValue.firstName} />
          <ErrorMessage name="firstName" />
          <label htmlFor="lastName">Last Name</label>
          <Field id="lastName" type="text" name="lastName" value={singleFormValue.lastName} />
          <ErrorMessage name="lastName" />
          <div id="my-radio-group">Gender : </div>
          <span>
            <label>
              <Field type="radio" name="radioGroup" value="One" selected="selected"/>
              Male
            </label>
            <label>
              <Field type="radio" name="radioGroup" value="Two" />
              Female
            </label>
            <br />
            <ErrorMessage name="radioGroup" />
          </span>

          <label htmlFor="email">Email</label>
          <Field id="email" type="email" name="email" value={singleFormValue.email} />
          <ErrorMessage name="email" />

          <label htmlFor="mobileNumber">Mobile Number</label>
          <Field id="mobileNumber" type="tel" name="mobileNumber" value={singleFormValue.mobileNumber} />
          <ErrorMessage name="mobileNumber" />
          <label>
            <Field type="checkbox" name="toggle" />I agree the terms and
            conditions.
            <br />
            <ErrorMessage name="toggle" />
          </label>
          <button type="submit">Submit</button>
        </Form>
      </Formik>
      <Table responsive hover className="table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Mobile Number</th>
            <th>Checked</th>
          </tr>
        </thead>
        <tbody>
          {formValues.map((user, index) => {
            return (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.gender}</td>
                <td>{user.email}</td>
                <td>{user.mobileNumber}</td>
                <td>
                  <button
                    onClick={() => 
                      editHandler(user.id)
                    }
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      deleteHandler(user.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div></>
  );
}
