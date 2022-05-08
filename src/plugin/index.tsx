import { render } from "preact";
import { toBlob } from "html-to-image";
import { ReportModal } from "../components/ReportModal";
import * as constants from "../utils/constants";
import type { PluginState, CaptureWithModalOptions, SupportFormat } from "../types";

const pluginState: PluginState = { modal: { isOpened: false } };

const LIFFScreenShotPlugin = {
  name: "SS",
  async capture(format?: SupportFormat) {
    const blob = await toBlob(document.querySelector("body")!);
    return blob!;
  },
  async captureWithModal(
    format: SupportFormat,
    captureWithModalOptions?: CaptureWithModalOptions,
  ) {
    const opt = captureWithModalOptions || { dictionary: null };
    return new Promise((resolve) => {
      if (pluginState.modal.isOpened) {
        throw new Error("");
      }
      const callback = (result: { feedback?: string; data: string | Blob }) => {
        this.hideModal();
        resolve(result);
      };
      const modalRoot = document.createElement("div");
      modalRoot.id = constants.MODAL_ROOT_ID;
      (modalRoot as any).style =
        "width: 100%; height: 100%;z-index: 500000;position: fixed;left:0;top:0";
      Array
        .from(document.querySelectorAll("body > *"))
        .forEach((el) => {
          el.setAttribute("aria-hidden", "");
        });
      document.body.append(modalRoot);
      render(
        <ReportModal
          dicionary={opt.dictionary || {}}
          format={format}
          callback={callback}
        />,
        document.getElementById(constants.MODAL_ROOT_ID)!,
      );
    });
  },
  hideModal() {
    Array
      .from(document.querySelectorAll("body > *"))
      .forEach((el) => {
        el.removeAttribute("aria-hidden");
      });
    document.getElementById(constants.MODAL_ROOT_ID)!.remove();
    pluginState.modal.isOpened = false;
  },
  install() {
    return {
      capture: (format?: SupportFormat) => this.capture(format || "blob"),
      captureWithModal: (
        format: SupportFormat,
        captureWithModalOptions?: CaptureWithModalOptions,
      ) => this.captureWithModal(format || "blob", captureWithModalOptions),
      hideModal: () => this.hideModal(),
    };
  },
} as const;

export default LIFFScreenShotPlugin;
