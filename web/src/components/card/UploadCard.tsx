"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Button from "@/components/button/button";
import Card from "@/components/card/card";
import styles from "./upload.module.css";
import Image from "next/image";

export default function UploadCarousel() {
  const [selectedImgs, setSelectedImgs] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  function handleNext() {
    if (currentIndex < previewUrls.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedImgs(files);

      const urls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
      setCurrentIndex(0);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const formData = new FormData();
    selectedImgs.forEach((file) => {
      formData.append("images", file);
    });
    // TODO: доделать обработку запроса к API
  }

  function handleClick(_event: any): void {
    inputRef.current?.click();
  }

  return (
    <Card>
      <div className={styles.carouselContainer}>
        <h2 className={styles.headText}>Загрузите изображения</h2>

        {previewUrls.length > 0 && (
          <div className={styles.carousel}>
            <button
              type="button"
              className={styles.arrowButton}
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <img src="icons/right.svg"></img>
            </button>
            <div className={styles.imageWrapper}>
              <Image
                key={previewUrls[currentIndex]}
                src={previewUrls[currentIndex]}
                alt={`Preview ${currentIndex + 1}`}
                className={styles.carouselImage}
                width={563}
                height={444}
              />
            </div>
            <button
              type="button"
              className={styles.arrowButton}
              onClick={handleNext}
              disabled={currentIndex === previewUrls.length - 1}
            >
              <img src="icons/left.svg"></img>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.uploadForm}>
          <div className={styles.btns}>
            <Button size="large" type="button" onClick={handleClick}>
              Выбрать фотографию
            </Button>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              ref={inputRef}
              style={{ display: "none" }}
            />
            <Button size="large" type="submit">
              Загрузить
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
