import { BiMicrophone } from "react-icons/bi";
import { FiLink, FiUploadCloud } from "react-icons/fi";
import { BsDownload } from "react-icons/bs";
import { RxCopy } from "react-icons/rx";
import { IoTrashOutline } from "react-icons/io5";
import { AiOutlineFileWord } from "react-icons/ai";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

function Archive() {
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
            <tr>
              <td>
                <button className="table-icon red">
                  <FiLink className="link-btn__icon" />
                </button>
              </td>
              <td>
                <a href="">
                  https://irsv.upmusics.com/Downloads/Musics/Sirvan%20K...
                </a>
              </td>
              <td>۱۴۰۰-۰۸-۲۱</td>
              <td>.mp3</td>
              <td>۴:۲۹</td>
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
                  <span className="trash-icon">
                    <IoTrashOutline />
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <button className="table-icon blue">
                  <FiUploadCloud className="link-btn__icon" />
                </button>
              </td>
              <td>khaterate To</td>
              <td>۱۴۰۰-۰۸-۲۰</td>
              <td>.mp4</td>
              <td>۴:۲۸</td>
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
                  <span className="trash-icon">
                    <IoTrashOutline />
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <button className="table-icon red">
                  <FiLink className="link-btn__icon" />
                </button>
              </td>
              <td>
                <a href="">
                  https://irsv.upmusics.com/Downloads/Musics/Sirvan%20K...
                </a>
              </td>
              <td>۱۴۰۰-۰۸-۲۰</td>
              <td>.wav</td>
              <td>۳:۱۴</td>
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
                  <span className="trash-icon">
                    <IoTrashOutline />
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <button className="table-icon green">
                  <BiMicrophone className="link-btn__icon" />
                </button>
              </td>
              <td>پادکست رادیو راه - فصل دوم -قسمت ششم- راه سروش</td>
              <td>۱۴۰۰-۰۸-۱۹</td>
              <td>.mp3</td>
              <td>۱:۲۸:۱۸</td>
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
                  <span className="trash-icon">
                    <IoTrashOutline />
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <button className="table-icon red">
                  <FiLink className="link-btn__icon" />
                </button>
              </td>
              <td>
                <a href="">
                  https://irsv.upmusics.com/Downloads/Musics/Sirvan%20K...
                </a>
              </td>
              <td>۱۴۰۰-۰۸-۲۱</td>
              <td>.mp3</td>
              <td>۱:۲۸:۱۸</td>
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
                  <span className="trash-icon">
                    <IoTrashOutline />
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <button className="table-icon blue">
                  <FiUploadCloud className="link-btn__icon" />
                </button>
              </td>
              <td>khaterate To</td>
              <td>۱۴۰۰-۰۸-۲۰</td>
              <td>.mp4</td>
              <td>۴:۲۸</td>
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
                  <span className="trash-icon">
                    <IoTrashOutline />
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <button className="table-icon red">
                  <FiLink className="link-btn__icon" />
                </button>
              </td>
              <td>
                <a href="">
                  https://irsv.upmusics.com/Downloads/Musics/Sirvan%20K ...
                </a>
              </td>
              <td>۱۴۰۰-۰۸-۲۰</td>
              <td>.wav</td>
              <td>۳:۱۴</td>
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
                  <span className="trash-icon">
                    <IoTrashOutline />
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <button className="table-icon green">
                  <BiMicrophone className="link-btn__icon" />
                </button>
              </td>
              <td>پادکست رادیو راه - فصل دوم -قسمت ششم- راه سروش</td>
              <td>۱۴۰۰-۰۸-۱۹</td>
              <td>.mp3</td>
              <td>۱:۲۸:۱۸</td>
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
                  <span className="trash-icon">
                    <IoTrashOutline />
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="change-table">
        <FaChevronRight className="change-table-icon" />
        <span className="change-table-option">1</span>
        <span>...</span>
        <span className="change-table-option">123</span>
        <span className="change-table-option selected-option">124</span>
        <span className="change-table-option">125</span>
        <span className="change-table-option">126</span>
        <span>...</span>
        <span className="change-table-option">356</span>
        <FaChevronLeft className="change-table-icon" />
      </div>
    </div>
  );
}

export default Archive;
