import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ServiceImages() {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    api.get("/admin/services/images").then(res => setImages(res.data || []));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold">Service Images</h1>
      {images.map((img, i) => (
        <div key={i} className="border p-2 my-2">
          <img src={img.url} alt={img.alt} className="w-32 h-32" />
        </div>
      ))}
    </div>
  );
}
