import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CreatePost() {
  return (
    <div className="p-3 max-w-3xl min-h-screen">
      <h1 className="text-center my-7 text-3xl font-semibold">Create a Post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
          />
          <Select>
            <option value="categorized">Select a category</option>
            <option value="javaScript">JavaScript</option>
            <option value="reactJs">React.js</option>
            <option value="nextJs">Next.js</option>
          </Select>
        </div>
        <div
          className="flex gap-4 items-center justify-between 
        border-4 border-teal-500 border-dotted p-3"
        >
          <FileInput type="file" accept="image/*" />
          <Button
            type="button"
            gradientDuoTone="purpleToPink"
            size="sm"
            outline
          >
            Upload image
          </Button>
        </div>
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
        />
        <Button type="submit" gradientDuoTone={"purpleToPink"}>
          Publish
        </Button>
      </form>
    </div>
  );
}
