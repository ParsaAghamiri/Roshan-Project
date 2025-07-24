import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getRequests,
  deleteRequest,
  getRequestsFromUrl,
} from "../services/api";
import { BiMicrophone } from "react-icons/bi";
import { FiLink, FiUploadCloud } from "react-icons/fi";
import { BsDownload } from "react-icons/bs";
import { RxCopy } from "react-icons/rx";
import { IoTrashOutline } from "react-icons/io5";
import { AiOutlineFileWord } from "react-icons/ai";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import ArchiveResponse from "../components/ArchiveResponse";

const formatDuration = (durationString) => {
  if (!durationString || typeof durationString !== "string") return "--";
  try {
    const parts = durationString.split(":");
    const seconds = parseFloat(parts[2]);
    const minutes = parseInt(parts[1], 10);
    const hours = parseInt(parts[0], 10);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const displayMinutes = Math.floor(totalSeconds / 60);
    const displaySeconds = Math.floor(totalSeconds % 60);
    const paddedSeconds =
      displaySeconds < 10 ? `0${displaySeconds}` : displaySeconds;
    return `${displayMinutes}:${paddedSeconds}`;
  } catch (e) {
    return "--";
  }
};

const getIconInfo = (item) => {
  if (item.url && !item.url.includes("harf.roshan-ai.ir")) {
    return { Icon: FiLink, color: "red" };
  }
  if (item.filename && item.filename.includes("-recording.")) {
    return { Icon: BiMicrophone, color: "green" };
  }
  return { Icon: FiUploadCloud, color: "blue" };
};

const getPaginationRange = (totalPages, currentPage) => {
  const siblingCount = 1;
  const totalPageNumbers = siblingCount + 5;

  if (totalPageNumbers >= totalPages) {
    const range = [];
    for (let i = 1; i <= totalPages; i++) {
      range.push(i);
    }
    return range;
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    let leftItemCount = 3 + 2 * siblingCount;
    const range = [];
    for (let i = 1; i <= leftItemCount; i++) {
      range.push(i);
    }
    return [...range, "...", totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    let rightItemCount = 3 + 2 * siblingCount;
    const range = [];
    for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) {
      range.push(i);
    }
    return [firstPageIndex, "...", ...range];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const range = [];
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      range.push(i);
    }
    return [firstPageIndex, "...", ...range, "...", lastPageIndex];
  }

  const range = [];
  for (let i = 1; i <= totalPages; i++) {
    range.push(i);
  }
  return range;
};

const getTextFromItem = (item) => {
  if (item && item.segments && Array.isArray(item.segments)) {
    return item.segments.map((segment) => segment.text).join(" ");
  }
  return "";
};

const getSafeFilename = (item) => {
  const baseFilename = item.filename || "untitled";
  const cleanName = baseFilename
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, "_");
  return cleanName || "file";
};

const handleCopyText = (item) => {
  const text = getTextFromItem(item);
  if (text) {
    navigator.clipboard.writeText(text);
    toast.success("متن کپی شد!");
  } else {
    toast.error("متنی برای کپی یافت نشد!");
  }
};

const handleDownloadTxt = (item) => {
  const text = getTextFromItem(item);
  if (!text) {
    toast.error("متنی برای دانلود یافت نشد!");
    return;
  }

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${getSafeFilename(item)}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast.success("فایل متنی دانلود شد!");
};

const handleDownloadWord = (item) => {
  const text = getTextFromItem(item);
  if (!text) {
    toast.error("متنی برای دانلود یافت نشد!");
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${item.filename || "Document"}</title>
        <style>
          body { 
            font-family: 'Times New Roman', serif; 
            font-size: 12pt; 
            line-height: 1.6;
            direction: rtl;
            text-align: right;
            margin: 1in;
          }
          p { margin-bottom: 1em; }
        </style>
      </head>
      <body>
        <h1>${item.filename || "متن استخراج شده"}</h1>
        <p>${text.replace(/\n/g, "</p><p>")}</p>
      </body>
    </html>
  `;

  const blob = new Blob([htmlContent], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${getSafeFilename(item)}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast.success("فایل Word دانلود شد!");
};

function Archive() {
  const [archiveItems, setArchiveItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openItemId, setOpenItemId] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAllArchiveItems = async () => {
      setLoading(true);
      try {
        let allResults = [];
        let response = await getRequests();
        if (response.data.results) {
          allResults = allResults.concat(response.data.results);
        }

        while (response.data.next) {
          response = await getRequestsFromUrl(response.data.next);
          if (response.data.results) {
            allResults = allResults.concat(response.data.results);
          }
        }

        setArchiveItems(allResults);
      } catch (err) {
        setError("Failed to fetch archive items.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllArchiveItems();
  }, []);

  const handleDeleteItem = async (itemId) => {
    const originalItems = [...archiveItems];
    setArchiveItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    );
    try {
      await deleteRequest(itemId);
      toast.success("آیتم با موفقیت حذف شد!");
    } catch (err) {
      toast.error("خطا در حذف آیتم!");
      setArchiveItems(originalItems);
      console.error(err);
    }
  };

  const handleOpenItem = (itemId) => {
    setOpenItemId((prevOpenId) => (prevOpenId === itemId ? null : itemId));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = archiveItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(archiveItems.length / itemsPerPage);

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
            {loading ? (
              <tr>
                <td colSpan="6" style={{ direction: "ltr" }}>
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" style={{ color: "red" }}>
                  {error}
                </td>
              </tr>
            ) : (
              <TableBody
                items={currentItems}
                handleDeleteItem={handleDeleteItem}
                handleOpenItem={handleOpenItem}
                openItemId={openItemId}
              />
            )}
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

function TableBody({ items, handleDeleteItem, handleOpenItem, openItemId }) {
  if (!items || items.length === 0) {
    return (
      <tr>
        <td colSpan="6">No items found.</td>
      </tr>
    );
  }

  return items.map((item) => {
    const { Icon, color } = getIconInfo(item);
    const isOpen = openItemId === item.id;

    return (
      <React.Fragment key={item.id}>
        <tr>
          <td colSpan="6" style={{ padding: 0 }}>
            <div
              className={`expandable-row-container ${
                isOpen ? "expanded-row-border" : "collapsed-row-border"
              }`}
            >
              <div
                className="main-row-content"
                onClick={() => handleOpenItem(item.id)}
              >
                <div className="row-cell">
                  <button className={`table-icon ${color}`}>
                    <Icon />
                  </button>
                </div>
                <div className="row-cell filename-cell" title={item.filename}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.filename || "Untitled"}
                  </a>
                </div>
                <div className="row-cell">
                  {new Date(item.processed).toLocaleDateString("fa-IR")}
                </div>
                <div className="row-cell">
                  {(item.filename?.split(".").pop() || "---") + "."}
                </div>
                <div className="row-cell">{formatDuration(item.duration)}</div>
                <div className="row-cell actions-cell">
                  <div className="icon-group">
                    <span
                      className="download-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadTxt(item);
                      }}
                      title="دانلود فایل متنی"
                    >
                      <BsDownload />
                    </span>
                    <span
                      className="word-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadWord(item);
                      }}
                      title="دانلود فایل Word"
                    >
                      <AiOutlineFileWord />
                    </span>
                    <span
                      className="copy-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyText(item);
                      }}
                      title="کپی متن"
                    >
                      <RxCopy />
                    </span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="trash-icon"
                      title="حذف"
                    >
                      <IoTrashOutline />
                    </span>
                  </div>
                </div>
              </div>
              {isOpen && (
                <div className="expanded-content-container">
                  <div className="expanded-content-inner">
                    <ArchiveResponse
                      result={item}
                      onStartOver={() => handleOpenItem(item.id)}
                    />
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      </React.Fragment>
    );
  });
}

function Pagination({
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage,
  handlePageClick,
}) {
  const paginationRange = getPaginationRange(totalPages, currentPage);
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
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
      {paginationRange.map((pageNumber, index) => {
        if (typeof pageNumber === "string") {
          return (
            <span key={index} className="change-table-option dots">
              &#8230;
            </span>
          );
        }
        return (
          <span
            key={index}
            onClick={() => handlePageClick(pageNumber)}
            className={`change-table-option ${
              currentPage === pageNumber ? "selected-option" : ""
            }`}
          >
            {pageNumber}
          </span>
        );
      })}
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages || totalPages === 0}
        className="change-table-icon"
      >
        <FaChevronLeft />
      </button>
    </div>
  );
}
