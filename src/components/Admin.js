import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import axios from "axios";
import styles from "./Admin.module.css";
import { Link } from "react-router-dom";

function Admin() {
  const [stockList, setStockList] = useState([]);
  const [bill, setBill] = useState([]);
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
  const [totalSum, setTotalSum] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:4000/stock")
      .then((res) => {
        setStockList(res.data);
      })
      .catch((err) => console.log(err));

    axios.get("http://localhost:4000/bill")
      .then((res) => {
        const mergedBills = mergeDuplicateNames(res.data);
        setBill(mergedBills);
      })
      .catch((err) => console.log(err));
  }, []);

  const mergeDuplicateNames = (billData) => {
    const mergedBills = [];
    const nameMap = new Map();
    for (const bill of billData) {
      for (const item of bill) {
        const { name, quantity, totalPrice } = item;
        if (nameMap.has(name)) {
          const existingItem = nameMap.get(name);
          existingItem.quantity += quantity;
          existingItem.totalPrice += totalPrice;
        } else {
          const newItem = {
            name,
            quantity,
            totalPrice,
          };
          nameMap.set(name, newItem);
        }
      }
    }
    for (const [name, item] of nameMap) {
      mergedBills.push(item);
    }
    const totalSum = mergedBills.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    setTotalSum(totalSum);
    return mergedBills;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { imgURL, name, type } = values;
    const { hot, cold, smoothie } = type;

    if (!imgURL || !name || hot === 0 || cold === 0 || smoothie === 0) {
      alert("Please complete all fields.");
      return;
    }

    const newStock = {
      id: values.editId || nanoid(),
      imgURL: imgURL,
      name: name,
      type: {
        hot: parseInt(hot),
        cold: parseInt(cold),
        smoothie: parseInt(smoothie),
      },
    };

    if (values.editId) {
      axios.put(`http://localhost:4000/stock/${values.editId}`, newStock)
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
          alert("Edit Successfully");
          refreshStockList();
        })
        .catch((err) => console.log(err));
    } else {
      axios.post("http://localhost:4000/stock", newStock)
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
          alert("Save Successfully");
          refreshStockList();
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
    const confirmed = window.confirm("Do you want to delete this item?");
    if (confirmed) {
      axios.delete(`http://localhost:4000/stock/${id}`)
        .then((res) => {
          console.log(res.data);
          setStockList(stockList.filter((item) => item.id !== id));
          alert("Delete Successfully");
        })
        .catch((err) => console.log(err));
    }
  };

  const handleCancel = () => {
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
  };

  const refreshStockList = () => {
    axios.get("http://localhost:4000/stock")
      .then((res) => {
        setStockList(res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={styles.container}>
      <div className={styles.main1}>
        <div className={styles.mainlistmenu}>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Hot</th>
                <th>Cold</th>
                <th>Smoothie</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {stockList.map((stock) => (
                <tr key={stock.id}>
                  <td>
                    <img src={stock.imgURL} alt={stock.name} />
                  </td>
                  <td>{stock.name}</td>
                  <td>{stock.type.hot}</td>
                  <td>{stock.type.cold}</td>
                  <td>{stock.type.smoothie}</td>
                  <td>
                    <button
                      className="btedit"
                      type="button"
                      onClick={() => handleEdit(stock.id)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="btadmindelete"
                      type="button"
                      onClick={() => handleDelete(stock.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={styles.main2}>
        <div className={styles.addmenu}>
          <Link to="/" className={styles.ab}>
            X
          </Link>
          <div className={styles.formadd}>
            <div className={styles.texthead}>
            {values.editId ? "Edit Menu" : "Add Menu"}
            </div>
            <div className={styles.listinput}>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="imgURL">Image Url :</label>
                  <div className={styles.inputtext}>
                    <input
                      type="text"
                      name="imgURL"
                      className="form-control"
                      placeholder="Enter ImgURL"
                      value={values.imgURL}
                      onChange={(e) =>
                        setValues({ ...values, imgURL: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className={styles.inputtext}>
                  <label htmlFor="name">Name :</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter Name"
                    value={values.name}
                    onChange={(e) =>
                      setValues({ ...values, name: e.target.value })
                    }
                  />
                </div>
                <div className={styles.inputtext}>
                  <label htmlFor="hot">Hot :</label>
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
                <div className={styles.inputtext}>
                  <label htmlFor="cold">Cold :</label>
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
                <div className={styles.inputtext}>
                  <label htmlFor="smoothie">Smoothie :</label>
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
                <div className={styles.gapbt}>
                  <button type="submit" className="btaddupdate">
                    {values.editId ? "Update" : "Submit"}
                  </button>
                  {values.editId && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btadmindelete"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className={styles.main2billmenu}>
          <div className={styles.billtext}>Items sold out</div>
          <div className={styles.boxtable}>
            <table className={styles.billtable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {bill.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    {/* <td>{item.totalPrice}</td> แสดงผลรวม Total Price */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.billtotal}>
            <p>Total : {totalSum}</p>
            <div>
              {/* <button className="btadmindelete">Reset</button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
