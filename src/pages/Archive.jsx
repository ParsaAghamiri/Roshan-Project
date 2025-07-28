import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { fetchArchive, deleteArchiveItem } from "../features/archiveSlice";
import { BiMicrophone } from "react-icons/bi";
import { FiLink, FiUploadCloud } from "react-icons/fi";
import { BsDownload } from "react-icons/bs";
import { RxCopy } from "react-icons/rx";
import { IoTrashOutline } from "react-icons/io5";
import { AiOutlineFileWord } from "react-icons/ai";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import ArchiveResponse from "../components/ArchiveResponse";

const toPersianNumbers = (str) => {
  if (str === null || str === undefined) return "";
  const persian = {
    0: "۰",
    1: "۱",
    2: "۲",
    3: "۳",
    4: "۴",
    5: "۵",
    6: "۶",
    7: "۷",
    8: "۸",
    9: "۹",
  };
  return str.toString().replace(/[0-9]/g, (match) => persian[match]);
};

const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

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
    const result = `${displayMinutes}:${paddedSeconds}`;
    return toPersianNumbers(result);
  } catch (e) {
    return "--";
  }
};

const getIconInfo = (item) => {
  if (item.url && !item.url.includes("harf.roshan-ai.ir")) {
    return { Icon: FiLink, color: "red", type: "link" };
  }
  if (item.filename && item.filename.includes("-recording.")) {
    return { Icon: BiMicrophone, color: "green", type: "voice" };
  }
  return { Icon: FiUploadCloud, color: "blue", type: "upload" };
};

const getPaginationRange = (totalPages, currentPage) => {
  const siblingCount = 1;
  const totalPageNumbers = siblingCount + 5;
  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;
  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    let leftItemCount = 3 + 2 * siblingCount;
    let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "...", totalPages];
  }
  if (shouldShowLeftDots && !shouldShowRightDots) {
    let rightItemCount = 3 + 2 * siblingCount;
    let rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + 1 + i
    );
    return [firstPageIndex, "...", ...rightRange];
  }
  if (shouldShowLeftDots && shouldShowRightDots) {
    let middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
  }
  return Array.from({ length: totalPages }, (_, i) => i + 1);
};

const getTextFromItem = (item) => {
  if (item && item.segments && Array.isArray(item.segments)) {
    return item.segments.map((segment) => segment.text).join(" ");
  }
  return "";
};

const getSafeFilename = (item) => {
  const baseFilename = item.filename || "untitled";
  return (
    baseFilename
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, "_") || "file"
  );
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
    <!DOCTYPE html><html><head><meta charset="UTF-8"><title>${
      item.filename || "Document"
    }</title><style>body{font-family:'Times New Roman',serif;font-size:12pt;direction:rtl;text-align:right;}</style></head><body><p>${text.replace(
    /\n/g,
    "</p><p>"
  )}</p></body></html>`;
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
  const dispatch = useDispatch();
  const {
    items: archiveItems,
    status,
    error,
  } = useSelector((state) => state.archive);

  const [currentPage, setCurrentPage] = useState(1);
  const [openItemId, setOpenItemId] = useState(null);
  const [textSizes, setTextSizes] = useState({});
  const itemsPerPage = 5;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchArchive());
    }
  }, [status, dispatch]);

  const handleOpenItem = (itemId) => {
    setOpenItemId((prevOpenId) => (prevOpenId === itemId ? null : itemId));
  };

  const handleShowTextSize = (item) => {
    if (textSizes[item.id]) return;

    const text = getTextFromItem(item);
    const blob = new Blob([text]);
    const formattedSize = formatBytes(blob.size);
    setTextSizes((prev) => ({ ...prev, [item.id]: formattedSize }));
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
            {status === "loading" ? (
              <tr>
                <td colSpan="6" style={{ direction: "ltr" }}>
                  Loading...
                </td>
              </tr>
            ) : status === "failed" ? (
              <tr>
                <td colSpan="6" style={{ color: "red" }}>
                  {error}
                </td>
              </tr>
            ) : (
              <TableBody
                items={currentItems}
                openItemId={openItemId}
                textSizes={textSizes}
                dispatch={dispatch}
                handleOpenItem={handleOpenItem}
                handleShowTextSize={handleShowTextSize}
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

function TableBody({
  items,
  openItemId,
  textSizes,
  dispatch,
  handleOpenItem,
  handleShowTextSize,
}) {
  if (!items || items.length === 0) {
    return (
      <tr>
        <td colSpan="6">No items found.</td>
      </tr>
    );
  }

  return items.map((item) => {
    const { Icon, color, type } = getIconInfo(item);
    const isOpen = openItemId === item.id;

    return (
      <React.Fragment key={item.id}>
        <tr>
          <td colSpan="6" style={{ padding: 0 }}>
            <div
              className={`expandable-row-container ${
                isOpen ? `expanded-row-border-${type}` : "collapsed-row-border"
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
                  {toPersianNumbers(
                    new Date(item.processed).toLocaleDateString("fa-IR")
                  )}
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
                      onMouseEnter={() => handleShowTextSize(item)}
                      title={
                        textSizes[item.id]
                          ? `${textSizes[item.id]}`
                          : "دانلود فایل متنی"
                      }
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
                        dispatch(deleteArchiveItem(item.id));
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
                    <ArchiveResponse result={item} type={type} />
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
            {toPersianNumbers(pageNumber)}
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
