import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Users.module.css";
import { AiOutlineShoppingCart, AiOutlineDelete } from "react-icons/ai";
import { GrHomeRounded } from "react-icons/gr";
import "./../App.css";

function Users() {
  const [data, setData] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:4000/stock")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const sum = purchasedItems.reduce(
      (total, item) => total + item.selectedPrice * (item.quantity || 1),
      0
    );
    setTotalPrice(sum);
  }, [purchasedItems]);

  const handleTypeChange = (event, index) => {
    const { value } = event.target;
    const newData = [...data];
    newData[index].selectedType = value;
    setData(newData);
  };

  const incrementQuantity = (index) => {
    const newData = [...data];
    const currentQuantity = newData[index].quantity || 1;
    newData[index].quantity = currentQuantity + 1;
    setData(newData);
  };

  const decrementQuantity = (index) => {
    const newData = [...data];
    const currentQuantity = newData[index].quantity || 1;
    if (currentQuantity > 1) {
      newData[index].quantity = currentQuantity - 1;
      setData(newData);
    }
  };

  const handleBuy = (index) => {
    const { imgURL, name } = data[index];
    const selectedType = data[index].selectedType;

    // ตรวจสอบว่ารายการสินค้าที่เลือกซื้อซ้ำหรือไม่
    const isDuplicate = purchasedItems.some(
      (item) => item.name === name && item.type === selectedType
    );

    if (isDuplicate) {
      console.log("รายการนี้มีอยู่ใน purchasedItems แล้ว");
      return; // ไม่ทำการซื้อสินค้าซ้ำ
    }

    const selectedPrice = data[index].type[selectedType];

    const purchasedItem = {
      imgURL,
      name,
      type: selectedType,
      selectedPrice,
      quantity: data[index].quantity || 1,
    };

    setPurchasedItems((prevItems) => [...prevItems, purchasedItem]);
    console.log("ซื้อสินค้า:", purchasedItem);
  };

  const handleDelete = (index) => {
    setPurchasedItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };
  
  const handlePayment = () => {
    console.log("ราคารวมทั้งหมด:", totalPrice);
    if (purchasedItems.length > 0) {
      const billData = purchasedItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        totalPrice: item.selectedPrice * item.quantity,
      }));
  
      axios
        .post("http://localhost:4000/bill", billData)
        .then((res) => {
          console.log("บันทึกข้อมูลเรียบร้อยแล้ว:", res.data);
          alert("Payment Complete.");
          setPurchasedItems([]);
        })
        .catch((err) => {
          console.log("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", err);
          alert("An error occurred during payment.");
        });
    } else {
      alert("No items to pay for.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main1}>
        <div className={styles.textqd}>Quadra Coffee</div>
        <Link to="/" className={styles.bthome}>
          <button className={styles.Btn}>
            <div className={styles.mgbtn}>
              <GrHomeRounded />
            </div>
          </button>
        </Link>
      </div>
      <div className={styles.main2}>
        <div className={styles.scrollmain}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col">Type</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i}>
                  <td>
                    <img
                      className={styles.imgmenu}
                      src={d.imgURL}
                      alt="สินค้า"
                    />
                  </td>
                  <td>{d.name}</td>
                  <td>
                    <select
                      className={styles.selectmenu}
                      value={d.selectedType || ""}
                      onChange={(e) => handleTypeChange(e, i)}
                    >
                      <option value="">Select</option>
                      <option value="hot">Hot</option>
                      <option value="cold">Cold</option>
                      <option value="smoothie">Smoothie</option>
                    </select>
                  </td>
                  <td>
                    {d.selectedType && d.selectedType !== "เลือกประเภท" ? (
                      <>{d.type[d.selectedType]} บาท</>
                    ) : null}
                  </td>
                  <td>
                    <div>
                      <button
                        className="btEfminusplus"
                        onClick={() => decrementQuantity(i)}
                      >
                        -
                      </button>
                      <span> &nbsp;&nbsp;{d.quantity || 1}&nbsp;&nbsp;</span>
                      <button
                        className="btEfminusplus"
                        onClick={() => incrementQuantity(i)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      className="btEfshop"
                      onClick={() => handleBuy(i)}
                      type="button"
                      disabled={
                        !d.selectedType ||
                        d.selectedType === "เลือกประเภท" ||
                        purchasedItems.some(
                          (item) =>
                            item.name === d.name && item.type === d.selectedType
                        )
                      }
                    >
                      <div className={styles.mgbtnshop}>
                        <AiOutlineShoppingCart />
                      </div>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={styles.main3}>
        <div className={styles.card}>
          <div className={styles.textcard1}>
            <p>Ordered Items</p>
          </div>
          <div className={styles.textcard2}>
            <table className={styles.tablecard}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {purchasedItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.type} </td>
                    <td>{item.selectedPrice}</td>
                    <td>{item.quantity}</td>
                    <td>{item.selectedPrice * item.quantity} Bath</td>
                    <td>
                      <button
                        className="btdelete"
                        onClick={() => handleDelete(index)}
                      >
                        <AiOutlineDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.textcard3}>
            Total Price : {totalPrice} Bath
            {purchasedItems.length > 0 ? (
              <button className="btpayment" onClick={handlePayment}>
                Pay
              </button>
            ) : (
              <button className="btpayment" disabled>
                Pay
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
