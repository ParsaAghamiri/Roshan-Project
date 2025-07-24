import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { BiMicrophone } from "react-icons/bi";
import { FiLink, FiUploadCloud } from "react-icons/fi";
import { BsDownload } from "react-icons/bs";
import { RxCopy } from "react-icons/rx";
import { IoTrashOutline } from "react-icons/io5";
import { AiOutlineFileWord } from "react-icons/ai";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const formatDuration = (totalSeconds) => {
  if (typeof totalSeconds !== "number" || !isFinite(totalSeconds)) {
    return "--";
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${paddedSeconds}`;
};

function Archive() {
  const { archiveItems, handleDeleteItem } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = archiveItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(archiveItems.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="archive-container">
      <span className="archive-header">آرشیو من</span>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>نام فایل</th>
              <th>تاریخ بارگذاری</th>
              <th>نوع فایل</th>
              <th>مدت زمان</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <TableBody
              items={currentItems}
              handleDeleteItem={handleDeleteItem}
            />
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        handlePageClick={handlePageClick}
      />
    </div>
  );
}

export default Archive;

function TableBody({ items, handleDeleteItem }) {
  if (items.length === 0) {
    return (
      <tr>
        <td colSpan="6">No items have been added yet.</td>
      </tr>
    );
  }

  return items.map((item) => (
    <tr key={item.id}>
      <td>
        <button
          className={`table-icon ${
            item.source_type === "LINK"
              ? "red"
              : item.source_type === "UPLOAD"
              ? "blue"
              : "green"
          }`}
        >
          {item.source_type === "LINK" && <FiLink />}
          {item.source_type === "UPLOAD" && <FiUploadCloud />}
          {item.source_type === "RECORD" && <BiMicrophone />}
        </button>
      </td>
      <td className="truncate-text" title={item.file_name}>
        {item.source_type === "LINK" ? (
          <a href={item.file_name} target="_blank" rel="noopener noreferrer">
            {item.file_name}
          </a>
        ) : (
          item.file_name
        )}
      </td>
      <td>{new Date(item.created_at).toLocaleDateString("fa-IR")}</td>
      <td>{item.file_type || ".---"}</td>
      <td>{formatDuration(item.duration)}</td>
      <td>
        <div className="icon-group">
          <span className="download-icon">
            <BsDownload />
          </span>
          <span className="word-icon">
            <AiOutlineFileWord />
          </span>
          <span className="copy-icon">
            <RxCopy />
          </span>
          <span
            onClick={() => handleDeleteItem(item.id)}
            className="trash-icon"
          >
            <IoTrashOutline />
          </span>
        </div>
      </td>
    </tr>
  ));
}

function Pagination({
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage,
  handlePageClick,
}) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.max(1, totalPages); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="change-table">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className="change-table-icon"
      >
        <FaChevronRight />
      </button>
      {pageNumbers.map((number) => (
        <span
          key={number}
          onClick={() => handlePageClick(number)}
          className={`change-table-option ${
            currentPage === number ? "selected-option" : ""
          }`}
        >
          {number}
        </span>
      ))}
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="change-table-icon"
      >
        <FaChevronLeft />
      </button>
    </div>
  );
}
