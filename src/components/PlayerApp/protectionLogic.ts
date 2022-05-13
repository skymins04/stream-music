import {
  FLAG_NETWORK_STATUS,
  FLAG_PROTECTOR,
  PROTECTOR_CONTENT,
} from "../common/stores";
import { infoToast, errorToast } from "../common/toast";

(() => {
  const agent = window.navigator.userAgent.toLowerCase();
  if (agent.indexOf("mobile") !== -1) {
    FLAG_PROTECTOR.set(true);
    PROTECTOR_CONTENT.set("모바일은 지원하지 않습니다.");
  }

  // 실수로 페이지를 빠져나가는 것을 방지
  window.addEventListener("beforeunload", (event) => {
    event.preventDefault();
    event.returnValue = "";
  });

  FLAG_NETWORK_STATUS.set(window.navigator.onLine);
  if (!window.navigator.onLine) {
    errorToast("네트워크가 연결되지 않았습니다. 연결상태를 확인하세요.");
  }
  window.addEventListener("online", () => {
    infoToast("네트워크가 연결되었습니다.");
    FLAG_NETWORK_STATUS.set(true);
  });
  window.addEventListener("offline", () => {
    errorToast("네트워크가 해제가 감지되었습니다.");
    FLAG_NETWORK_STATUS.set(false);
  });
})();
