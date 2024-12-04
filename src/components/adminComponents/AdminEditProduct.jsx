import { useNavigate, useParams } from "react-router-dom";
import {
  useEditProductMutation,
  useGetActiveCategoryQuery,
  useGetEditProductQuery,
} from "../../services/adminApi";
import { motion } from "framer-motion";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import "react-image-crop/dist/ReactCrop.css";
import { useEffect, useRef, useState } from "react";
import { Crop, Trash2, Upload } from "lucide-react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import { getCroppedImg } from "../../utils/imageCrop";
import { uploadImagesToCloudinary } from "../../services/cloudinary/cloudinary";

const AdminEditProduct = () => {
  const navigate = useNavigate();
  const { product_id } = useParams();
  const { data: product } = useGetEditProductQuery({ product_id: product_id });
  const { data } =useGetActiveCategoryQuery();
  const [editProduct, { error }] = useEditProductMutation();
  const [form, setForm] = useState({
    productName: "",
    price: "",
    stock: "",
    carat: "",
    description: "",
    category: "",
    origin: "",
    images: [],
    _id: "",
  });
  const [images, setImages] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [imgerr, setImgerr] = useState(false);
  const [isLoading,setIsLoading]=useState(false)

  //for add the active categories and editing details
  useEffect(() => {
    if (data && data.categoryList) {
      setCategoryList([...data.categoryList]);
    }
    setForm({
      productName: product?.product?.productName || "",
      price: product?.product?.price || "",
      stock: product?.product?.stock || "",
      carat: product?.product?.carat || "",
      description: product?.product?.description || "",
      category: product?.product?.category || "",
      origin: product?.product?.origin || "",
    });
    setImages(product?.product?.images);
  }, [data, product]);

  //for handling the image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentImage(URL.createObjectURL(file));
      setCrop(
        centerCrop(
          makeAspectCrop(
            { width: 80, aspect: 4 / 3 },
            imgRef.current.width / imgRef.current.height
          )
        )
      );
    }
  };

  // handling the image after croping and add to cloudinary and set the url to images
  const handleCropComplete = async () => {
    if (completedCrop && imgRef.current) {
      const croppedImageUrl = await getCroppedImg(
        imgRef.current,
        completedCrop
      );
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], "cropped.jpeg", { type: "image/jpeg" });
      setIsLoading(true)
      const imgUrl = await uploadImagesToCloudinary(file);
      setIsLoading(false)
      setImages((prevImages) => [...prevImages, imgUrl]);
      setCurrentImage(null);
      setCrop(null);
    }
  };

  //for deleting the selected image
  const handleImageDelete = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  //for handling form
  const handleForm = async (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // for handling form submision
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length < 3) {
       setImgerr(true);
    } else {
      setImgerr(false);
    }
    const completeForm = {
      ...form,
      images: images,
      _id: product_id,
    };
    const response = await editProduct(completeForm);
    if (response.data) {
      navigate("/admin/products");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-800 text-white p-8 mt-5 ml-64"
    >
      {/* // <div className="min-h-screen bg-gray-800 text-white p-8 mt-5 ml-64"> */}
      <div className="max-w-4xl mx-auto bg-[#111827] rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            fullWidth
            label={
              error?.data?.messageToProductname
                ? error.data.messageToProductname
                : "Product Name"
            }
            variant="outlined"
            name="productName"
            value={form.productName}
            onChange={handleForm}
            sx={
              error?.data?.messageToProductname
                ? {
                    "& .MuiInputLabel-root": { color: "red" },
                    "& .MuiOutlinedInput-root": {
                      color: "red",
                      "& fieldset": { borderColor: "red" },
                      "&:hover fieldset": { borderColor: "red" },
                      "&.Mui-focused fieldset": { borderColor: "red" },
                    },
                  }
                : {
                    "& .MuiInputLabel-root": { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": { borderColor: "white" },
                      "&:hover fieldset": { borderColor: "white" },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                  }
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextField
              fullWidth
              label={
                error?.data?.messageToStock
                  ? error.data.messageToStock
                  : "Stock"
              }
              type="number"
              variant="outlined"
              name="stock"
              value={form.stock}
              onChange={handleForm}
              sx={
                error?.data?.messageToStock
                  ? {
                      "& .MuiInputLabel-root": { color: "red" },
                      "& .MuiOutlinedInput-root": {
                        color: "red",
                        "& fieldset": { borderColor: "red" },
                        "&:hover fieldset": { borderColor: "red" },
                        "&.Mui-focused fieldset": { borderColor: "red" },
                      },
                    }
                  : {
                      "& .MuiInputLabel-root": { color: "white" },
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                    }
              }
            />
            <TextField
              fullWidth
              label={
                error?.data?.messageToCarat
                  ? error.data.messageToCarat
                  : "Carat"
              }
              type="number"
              variant="outlined"
              name="carat"
              value={form.carat}
              onChange={handleForm}
              sx={
                error?.data?.messageToCarat
                  ? {
                      "& .MuiInputLabel-root": { color: "red" },
                      "& .MuiOutlinedInput-root": {
                        color: "red",
                        "& fieldset": { borderColor: "red" },
                        "&:hover fieldset": { borderColor: "red" },
                        "&.Mui-focused fieldset": { borderColor: "red" },
                      },
                    }
                  : {
                      "& .MuiInputLabel-root": { color: "white" },
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                    }
              }
            />
            <TextField
              fullWidth
              label={
                error?.data?.messageToPrice
                  ? error.data.messageToPrice
                  : "Price"
              }
              type="number"
              variant="outlined"
              name="price"
              value={form.price}
              onChange={handleForm}
              sx={
                error?.data?.messageToPrice
                  ? {
                      "& .MuiInputLabel-root": { color: "red" },
                      "& .MuiOutlinedInput-root": {
                        color: "red",
                        "& fieldset": { borderColor: "red" },
                        "&:hover fieldset": { borderColor: "red" },
                        "&.Mui-focused fieldset": { borderColor: "red" },
                      },
                    }
                  : {
                      "& .MuiInputLabel-root": { color: "white" },
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                    }
              }
            />
          </div>
          <TextField
            fullWidth
            label={
              error?.data?.messageToDescription
                ? error.data.messageToDescription
                : "Description"
            }
            multiline
            rows={4}
            variant="outlined"
            name="description"
            value={form.description}
            onChange={handleForm}
            sx={
              error?.data?.messageToDescription
                ? {
                    "& .MuiInputLabel-root": { color: "red" },
                    "& .MuiOutlinedInput-root": {
                      color: "red",
                      "& fieldset": { borderColor: "red" },
                      "&:hover fieldset": { borderColor: "red" },
                      "&.Mui-focused fieldset": { borderColor: "red" },
                    },
                  }
                : {
                    "& .MuiInputLabel-root": { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": { borderColor: "white" },
                      "&:hover fieldset": { borderColor: "white" },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                  }
            }
          />
          <div className="flex flex-cols-1 md:flex-cols-2 gap-4">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="category-label" sx={{ color: "white" }}>
                Category
              </InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={form.category}
                onChange={handleForm}
                label="Category"
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                }}
              >
                {categoryList.map((category, index) => (
                  <MenuItem key={index} value={category.category}>
                    {category.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label={
                error?.data?.messageToOrigin
                  ? error.data.messageToOrigin
                  : "Origin"
              }
              variant="outlined"
              name="origin"
              value={form.origin}
              onChange={handleForm}
              sx={
                error?.data?.messageToOrigin
                  ? {
                      "& .MuiInputLabel-root": { color: "red" },
                      "& .MuiOutlinedInput-root": {
                        color: "red",
                        "& fieldset": { borderColor: "red" },
                        "&:hover fieldset": { borderColor: "red" },
                        "&.Mui-focused fieldset": { borderColor: "red" },
                      },
                    }
                  : {
                      "& .MuiInputLabel-root": { color: "white" },
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                    }
              }
            />
          </div>
          
          <Button
            onClick={() => document.getElementById("image-upload").click()}
            startIcon={<Upload />}
          >
            Upload Image
          </Button>
          <input
            type="file"
            id="image-upload"
            onChange={handleImageUpload}
            hidden
          />
          {currentImage && (
            <div className="flex flex-col mt-4 ">
              <ReactCrop
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                onComplete={setCompletedCrop}
              >
                <img ref={imgRef} src={currentImage} alt="Crop preview" />
              </ReactCrop>
              <Button onClick={handleCropComplete} startIcon={<Crop />}>
                {isLoading?"Adding...":"Add"}
              </Button>
            </div>
          )}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {images?.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleImageDelete(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          {imgerr && <p className="text-red-500 text-sm">Images must be 3</p>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            className="bg-green-500 hover:bg-green-600 w-full"
          >
            Edit Product
          </Button>
        </form>
      </div>
    </motion.div>
  );
};
export default AdminEditProduct;
