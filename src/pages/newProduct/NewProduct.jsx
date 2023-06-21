import { useState } from "react";
import "./newProduct.css";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import app from "../../firebase";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/apiCalls";

export default function NewProduct() {
  const [ inputs, setInputs ] = useState({})
  const [ file, setFile ] = useState(null)
  const [ cat, setCat ] = useState([])
  const [ size, setSize ] = useState([])
  const [ color, setColor ] = useState([])
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setInputs(prev=>{
      return {...prev, [e.target.name]:e.target.value}
    })
  }

  const handleCat = (e) => {
    setCat(e.target.value.split(","))
  }
  const handleSize = (e) => {
    setSize(e.target.value.split(","))
  }
  const handleColor = (e) => {
    setColor(e.target.value.split(","))
  }

  const handleClick = (e) => {
    e.preventDefault();
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName)
  
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // Handle unsuccessful uploads
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const product = { ...inputs, img: downloadURL, categories: cat, size: size, color: color };
          addProduct(product,dispatch)
        });
      }
    );
  };

  console.log(file)

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Product</h1>
      <form className="addProductForm">
        <div className="addProductItem">
          <label>Image</label>
          <input type="file" id="file" onChange={e=> setFile(e.target.files[0])}/>
        </div>
        <div className="addProductItem">
          <label>Title</label>
          <input name="title" type="text" placeholder="Apple Airpods" onChange={handleChange} />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <input name="desc" type="text" placeholder="description..." onChange={handleChange} />
        </div>
        <div className="addProductItem">
          <label>Price</label>
          <input name="price" type="number" placeholder="100" onChange={handleChange} />
        </div>
        <div className="addProductItem">
          <label>Categories</label>
          <input type="text" placeholder="Trousers,Shirts,Shorts,men,women"  onChange={handleCat}/>
        </div>
        <div className="addProductItem">
          <label>Size</label>
          <input type="text" placeholder="XXL,XL"  onChange={handleSize}/>
        </div>
        <div className="addProductItem">
          <label>Color</label>
          <input type="text" placeholder="Black,White"  onChange={handleColor}/>
        </div>
        <div className="addProductItem">
          <label>Stock</label>
          <select name="inStock" id="active"  onChange={handleChange}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </form>
        <button onClick={handleClick} className="addProductButton">Create</button>
    </div>
  );
}
