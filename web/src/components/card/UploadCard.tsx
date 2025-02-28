"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Button from "@/components/button/button";
import Card from "@/components/card/card";
import styles from "./upload.module.css";
import Image from "next/image";
import Carousel from "../carousel/carousel";
import { motion, AnimatePresence } from "framer-motion";
import ResultCard from "./ResultCard";

export default function UploadCarousel() {
  const [selectedImgs, setSelectedImgs] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  let showZone = 1;
  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  function handleFileChange(event: any): void {
    // ChangeEvent<HTMLInputElement>
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
    const files: File[] = Array.from(event.target.files);

    setPreviewUrls((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });

    if (!event.target.files || event.target.files.length === 0) {
      setSelectedImgs([]);
      setCurrentIndex(0);
      event.target.value = "";
      return;
    }
    const validFiles = files.filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        console.warn(`Файл ${file.name} имеет неподдерживаемый формат`);
        return false;
      }
      return true;
    });

    if (event.target.files) {
      const files: File[] = Array.from(event.target.files);
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
    console.log(formData);
    console.log(selectedImgs);
    setShowResult(true);
    setTimeout(() => {
      setResult({ success: true, data: "Результат обработки" });
    }, 2000);
    // TODO: доделать обработку запроса к API
  }

  function handleClick(_event: any): void {
    inputRef.current?.click();
  }

  const handleClear = () => {
    setSelectedImgs([]);
    setPreviewUrls([]);
    setCurrentIndex(0);
    setShowResult(false);
    setResult(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={styles.pageContainer}>
      <motion.div
        ref={containerRef}
        className={styles.mainContent}
        animate={{
          marginRight: showResult ? "5vw" : "0",
          transition: { duration: 0.3 },
        }}
      >
        <Card>
          <div className={styles.carouselContainer}>
            <h2 className={styles.headText}>Форма для загрузки фотографий</h2>

            {previewUrls.length > 0 && <Carousel previewUrls={previewUrls} />}

            <form onSubmit={handleSubmit} className={styles.uploadForm}>
              {previewUrls.length === 0 && (
                <div
                  className={styles.dropzone}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add(styles.dragover);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove(styles.dragover);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove(styles.dragover);
                    if (e.dataTransfer.files) {
                      handleFileChange(e);
                    }
                  }}
                  onClick={() => inputRef.current?.click()}
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    ref={inputRef}
                    style={{ display: "none" }}
                  />
                  <div className={styles.dropzoneContent}>
                    <p>Нажмите чтобы загрузить или перетащите фотографии</p>
                    <small>Поддерживаемые форматы: JPEG, PNG, WEBP</small>
                  </div>
                </div>
              )}

              <div className={styles.buttonsWrapper}>
                <Button
                  size="large"
                  type="button"
                  variant="green"
                  onClick={handleClear}
                  disabled={previewUrls.length === 0}
                >
                  Сбросить
                </Button>
                <Button
                  size="large"
                  type="submit"
                  variant="mint"
                  disabled={previewUrls.length === 0}
                >
                  Загрузить ({previewUrls.length})
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </motion.div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            className={styles.resultCard}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <ResultCard />
            {/* <Card>
              <div className={styles.resultContent}>
                {!result ? (
                  <div className={styles.loading}>
                    <p>Обработка изображений...</p>
                  </div>
                ) : (
                  <>
                    <h3>Результаты обработки</h3>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                    <Button size="small" onClick={() => setShowResult(false)}>
                      Скрыть
                    </Button>
                  </>
                )}
              </div>
            </Card> */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
