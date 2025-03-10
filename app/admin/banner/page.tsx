"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiEndpoint, imageEndpoint } from "@/helper/api";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import SectionTitle from "@/components/custom/SectionTitle";

function ImageUploadPage() {
  const [images, setImages] = useState<File[]>([]);
  const [indexes, setIndexes] = useState<number[]>([]);
  const [imagePreviews, setImagePreviews] = useState<
    { _id: string; url: string; index: number }[]
  >([]);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await axios.get(`${apiEndpoint}/banner`);

      setImagePreviews(res.data.banners);
    };
    fetchImages();
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages(files);
    // Initialize indexes with same length as files, starting from current max index + 1
    const startIndex =
      imagePreviews.length > 0
        ? Math.max(...imagePreviews.map((img) => img.index)) + 1
        : 0;
    setIndexes(files.map((_, i) => startIndex + i));
  };

  const handleIndexChange = (index: number, value: number) => {
    const newIndexes = [...indexes];
    newIndexes[index] = value;
    setIndexes(newIndexes);
  };

  const handleUpload = async () => {
    const formData = new FormData();

    // Append each file and its corresponding index
    images.forEach((image) => {
      formData.append("files", image);
    });
    // Append indexes as a single JSON string
    formData.append("indexes", JSON.stringify(indexes));

    try {
      await axios.post(`${apiEndpoint}/banner`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Clear form and refresh images
      setImages([]);
      setIndexes([]);

      // Refresh the image previews
      const res = await axios.get(`${apiEndpoint}/banner`);
      setImagePreviews(
        res.data.banners.sort(
          (a: { index: number }, b: { index: number }) => a.index - b.index
        )
      );
      toast.success("Images uploaded successfully");
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Error uploading images. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${apiEndpoint}/banner/${id}`);
      toast.success("Banner deleted successfully");
      // Refresh the image previews
      const res = await axios.get(`${apiEndpoint}/banner`);
      setImagePreviews(
        res.data.banners.sort(
          (a: { index: number }, b: { index: number }) => a.index - b.index
        )
      );
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Error deleting banner. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <SectionTitle title="Customize Banner Images" hideBackButton />

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg mb-8 space-y-5">
        <div className="flex items-end gap-4">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className=" w-[20em] p-2 border border-gray-300 rounded"
          />
          {images.length > 0 && (
            <Button onClick={handleUpload} variant="outline">
              Upload Image
            </Button>
          )}
        </div>
        {/* Preview of selected images with index inputs */}
        <div className="flex items-end">
          {images.map((image, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <Image
                src={URL.createObjectURL(image)}
                alt={`Preview ${idx}`}
                className="w-full h-40 object-cover mb-2 rounded"
                width={100}
                height={100}
              />
              <Input
                type="number"
                min="0"
                placeholder="Index"
                value={indexes[idx]}
                onChange={(e) => handleIndexChange(idx, Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Existing Images Section */}
      <div className="bg-white p-6 ">
        <h2 className="text-xl font-semibold mb-4">Existing Banner Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imagePreviews.map(({ url, index, _id }) => (
            <div key={index} className="border rounded-lg p-4 relative">
              <Button
                variant="outline"
                className="absolute top-2 right-2 px-2"
                onClick={() => handleDelete(_id)}
              >
                <Trash2 className="text-red-700 group-hover:text-red-600 h-4" />
              </Button>
              <Image
                src={`${imageEndpoint}/${url}`}
                width={100}
                height={100}
                alt={`Banner ${index}`}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <p className="text-center font-medium">Index: {index}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageUploadPage;
