import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import axios from "axios";
import { Link } from "react-router-dom";

function Admin() {
  const [values, setValues] = useState({
    imgURL: "",
    name: "",
    type: {
      hot: 0,
      cold: 0,
      smoothie: 0,
    },
    editId: null,
  });
  const [stockList, setStockList] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/stock")
      .then((res) => {
        setStockList(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const { imgURL, name, type } = values;
    const { hot, cold, smoothie } = type;

    const newStock = {
      id: nanoid(),
      imgURL: imgURL,
      name: name,
      type: {
        hot: parseInt(hot),
        cold: parseInt(cold),
        smoothie: parseInt(smoothie),
      },
    };

    if (values.editId) {
      axios
        .put(`http://localhost:4000/stock/${values.editId}`, newStock)
        .then((res) => {
          console.log(res.data);
          setValues({
            imgURL: "",
            name: "",
            type: {
              hot: 0,
              cold: 0,
              smoothie: 0,
            },
            editId: null,
          });
          alert("แก้ไขข้อมูลสำเร็จ");
          axios
            .get("http://localhost:4000/stock")
            .then((res) => {
              setStockList(res.data);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .post("http://localhost:4000/stock", newStock)
        .then((res) => {
          console.log(res.data);
          setValues({
            imgURL: "",
            name: "",
            type: {
              hot: 0,
              cold: 0,
              smoothie: 0,
            },
            editId: null,
          });
          alert("บันทึกข้อมูลสำเร็จ");
          axios
            .get("http://localhost:4000/stock")
            .then((res) => {
              setStockList(res.data);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  };

  const handleEdit = (id) => {
    const editedStock = stockList.find((item) => item.id === id);
    setValues({
      imgURL: editedStock.imgURL,
      name: editedStock.name,
      type: {
        hot: editedStock.type.hot,
        cold: editedStock.type.cold,
        smoothie: editedStock.type.smoothie,
      },
      editId: id,
    });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:4000/stock/${id}`)
      .then((res) => {
        console.log(res.data);
        setStockList(stockList.filter((item) => item.id !== id));
        alert("ลบข้อมูลสำเร็จ");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Link to="/" type="button">
        Home
      </Link>
      <h1>Add menu</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="imgURL">Picture : </label>
          <input
            type="text"
            name="imgURL"
            className="form-control"
            placeholder="Enter ImgURL"
            value={values.imgURL}
            onChange={(e) => setValues({ ...values, imgURL: e.target.value })}
          />
        </div>
        <br />
        <div>
          <label htmlFor="imgURL">Name : </label>
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Enter Name"
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
          />
        </div>
        <br />
        <div>
          <label htmlFor="imgURL">Type hot : </label>
          <input
            type="number"
            name="hot"
            className="form-control"
            placeholder="Enter type hot"
            value={values.type.hot}
            onChange={(e) =>
              setValues({
                ...values,
                type: { ...values.type, hot: e.target.value },
              })
            }
          />
        </div>
        <br />
        <div>
          <label htmlFor="imgURL">Type cold : </label>
          <input
            type="number"
            name="cold"
            className="form-control"
            placeholder="Enter cold"
            value={values.type.cold}
            onChange={(e) =>
              setValues({
                ...values,
                type: { ...values.type, cold: e.target.value },
              })
            }
          />
        </div>
        <br />
        <div>
          <label htmlFor="imgURL">Type smoothie : </label>
          <input
            type="number"
            name="smoothie"
            className="form-control"
            placeholder="Enter smoothie"
            value={values.type.smoothie}
            onChange={(e) =>
              setValues({
                ...values,
                type: { ...values.type, smoothie: e.target.value },
              })
            }
          />
        </div>
        <br />
        <button type="submit">
          {values.editId ? "Update" : "Submit"}
        </button>
      </form>
      <h2>Stock List</h2>
      <ul>
        {stockList.map((stock) => (
          <li key={stock.id}>
            <img src={stock.imgURL} alt={stock.name} style={{ width: "80px" }} />
            <span>{stock.name}</span>
            <span>Hot: {stock.type.hot}</span>
            <span>Cold: {stock.type.cold}</span>
            <span>Smoothie: {stock.type.smoothie}</span>
            <button onClick={() => handleEdit(stock.id)}>Edit</button>
            <button onClick={() => handleDelete(stock.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;
