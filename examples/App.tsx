import liff from "@line/liff";
import { useState } from "preact/compat";
import logo from "./logo.svg";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";

initializeApp({ storageBucket: `${import.meta.env.VITE_BUCKET_NAME}` });
const storage = getStorage();

const App: React.FC = () => {
  const [urlList, setUrlList] = useState<string[]>([]);

  const handleClickCapture = () => {
    liff.$SS
      .capture()
      .then((result) => {
        setUrlList((prev) => [...prev, URL.createObjectURL(result)]);
        const name = `${~~(Math.random() * 100)}-${new Date().getTime()}.png`;
        const ssRef = ref(storage, `ss/${name}`);
        uploadBytes(ssRef, result);
      });
  };

  const handleClickcaptureWithModal = () => {
    liff.$SS
      .captureWithModal("blob")
      .then(
        ({ data }) => {
          setUrlList((prev) => [...prev, URL.createObjectURL(data)]);
          const name = `${~~(Math.random() * 100)}-${new Date().getTime()}.png`;
          const ssRef = ref(storage, `ss/${name}`);
          uploadBytes(ssRef, data);
        },
      );
  };

  const handleClickShowI18nModal = () => {
    liff.$SS
      .captureWithModal(
        "blob",
        {
          dictionary: {
            title: "Send Feedback",
            placeholder: "Please provide details about your feedback.",
            note: "The information and screenshots will be used in accordance with our Terms of Service and Privacy Policy.",
            cancelText: "CANCEL",
            submitText: "SEND",
          },
        },
      )
      .then(
        ({ data }) => {
          setUrlList((prev) => [...prev, URL.createObjectURL(data)]);
          const name = `${~~(Math.random() * 100)}-${new Date().getTime()}.png`;
          const ssRef = ref(storage, `ss/${name}`);
          uploadBytes(ssRef, data);
        },
      );
  };

  return (
    <div className="App">
      <div className="main">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p className="buttons">
            <button type="button" onClick={handleClickCapture}>
              capture
            </button>
            <button type="button" onClick={handleClickcaptureWithModal}>
              captureWithModal
            </button>
            <button type="button" onClick={handleClickShowI18nModal}>
              captureWithModal(i18n option)
            </button>
          </p>
        </header>
      </div>
      <div className="side">
        <h2>ScreenShot</h2>
        <ul>
          {
            urlList.map((url) => (
              <li>
                <img src={url} key={url} />
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
};

export default App;
