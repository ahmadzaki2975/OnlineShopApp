import { useState, useEffect } from "react";
import Carousel from "./components/Carousel";
import Navbar from "./components/Navbar";
import UserIdentity from "./components/UserIdentity";
import Market from "./components/Market";
import FlashNotice from "./components/FlashNotice";
import { FaShoppingBasket } from "react-icons/fa";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  setDoc,
  doc,
} from "firebase/firestore";

function App() {
  const [username, setUsername] = useState(null);

  // const [items, setItems] = useState([]);

  let [itemsFromDB, setItemsDB] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newItemsDB = [];
      querySnapshot.forEach((doc) => {
        // console.log(doc.data());
        newItemsDB.push(doc.data());
      });
      setItemsDB(newItemsDB);
    });
  }, []);

  const itemValues = Object.values(itemsFromDB);
  const notYourItems = itemValues.filter((item) => {
    return item.seller != username;
  });

  //? Login function
  function loginHandler(uname) {
    setUsername(uname);
  }

  //? Logout function
  function logoutHandler() {
    setUsername(null);
  }

  //? Add item function
  async function addListingHandler(item) {
    try {
      const docRef = await addDoc(collection(db, "items"), item);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  //? Delete item function
  async function deleteItemHandler(id) {
    try {
      toString(id);
      const docRef = doc(db, "items", id);
      console.log(docRef);
      // await deleteDoc(docRef);
    } catch (error) {
      console.log(error);
    }
    // await deleteDoc(doc(db, "items", id));
  }

  //? Update item function
  async function updateItemHandler(id, updatedItem) {
    try {
      console.log(`Item with id ${id} updated`);
      // console.log(updatedItem);
      const docRef = doc(db, "items", id);
      await setDoc(docRef, updatedItem, {merge: true});
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="App">
      <Navbar className="navbar" currentUser={username} />
      <Carousel className="carousel" />

      <UserIdentity
        className="userId"
        currentUser={username}
        loginHandler={loginHandler}
        logoutHandler={logoutHandler}
        addListingHandler={addListingHandler}
        //? functions for YourCard
        itemsFromDB={itemsFromDB}
        deleteItemHandler={deleteItemHandler}
        updateItemHandler={updateItemHandler}
      />
      <div id="market" style={{ position: "relative", top: "-40px" }}></div>
      <div className="dashed-line"></div>
      <h1 className="text-center">
        MARKET <FaShoppingBasket />
      </h1>
      <Market
        itemsFromDB={itemsFromDB}
        username={username}
        notYourItems={notYourItems}
      />
    </div>
  );
}

export default App;
