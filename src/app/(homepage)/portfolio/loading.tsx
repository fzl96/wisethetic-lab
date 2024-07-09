import { ClipLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="grid min-h-screen w-full place-items-center">
      <ClipLoader color="#d9d9d9" />
    </div>
  );
}
