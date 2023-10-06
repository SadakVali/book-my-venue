import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import "video-react/dist/video-react.css";
import { Player } from "video-react";
import { GiCrossedBones } from "react-icons/gi";

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  editData = null,
  setState,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    editData ? editData : null
  );
  const inputRef = useRef(null);

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      previewFile(file);
      setSelectedFile(acceptedFiles);
      setState(true);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4", ".webm"] },
    onDrop,
  });

  useEffect(() => {
    register(name, { required: true });
  }, [register]);

  useEffect(() => {
    setValue(name, selectedFile);
  }, [selectedFile, setValue]);

  return (
    <div className="flex flex-col gap-y-6">
      <label className="text-[#949BA5] text-[1rem]" htmlFor={name}>
        {label}
      </label>
      <div
        className="w-full h-[20rem] rounded-[1.25rem] flex flex-col justify-center 
        items-center overflow-hidden"
        style={{
          boxShadow:
            "-4px -4px 4px 0px rgba(0, 0, 0, 0.25), 4px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div className="flex h-full w-full cursor-pointer items-center justify-center">
          {previewSource ? (
            <div className="relative h-full w-full flex flex-col rounded-[1.25rem]">
              {video ? (
                <Player
                  playsInline
                  src={previewSource}
                  fluid={false}
                  width="100%" // Constrain width to 100%
                  height="100%" // Constrain height to 100%
                />
              ) : (
                <img
                  src={previewSource}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-[1.25rem]"
                />
              )}
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("");
                  setSelectedFile(null);
                  setValue(name, null);
                  setState(false);
                }}
                className="text-[#28374B] flex justify-center items-center 
                text-[1.5rem] w-14 rounded-full bg-white aspect-square 
                absolute right-2 top-2 hover:scale-125"
              >
                <GiCrossedBones />
              </button>
            </div>
          ) : (
            <div
              className="flex w-full h-full flex-col justify-center items-center"
              {...getRootProps()}
            >
              <input
                {...getInputProps()}
                type="file"
                ref={inputRef}
                name={name}
                id={name}
              />
              <div
                className="grid aspect-square w-14 place-items-center rounded-full 
                bg-pure-greys-800"
              >
                <FiUploadCloud className="text-2xl text-white" />
              </div>
              <p className="mt-2 text-center text-[#28374B]">
                Drag and drop an {!video ? "image" : "video"}, or click <br />{" "}
                here to <span className="font-semibold">Browse</span> a file
              </p>
              <ul
                className="mt-4 flex flex-col list-none justify-between items-center 
                text-[#28374B]"
              >
                <li>Aspect ratio 16:9</li>
                <li>Recommended size 1024x576</li>
              </ul>
            </div>
          )}
        </div>
        {errors[name] && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            {name} is required
          </span>
        )}
      </div>
    </div>
  );
}
