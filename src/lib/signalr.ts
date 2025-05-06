import * as signalR from "@microsoft/signalr";
import Cookies from "js-cookie";

let connection: signalR.HubConnection | null = null;

export const createSignalRConnection = (): signalR.HubConnection => {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/chatHub", {
        withCredentials: true,
        accessTokenFactory: () => {
          const token = Cookies.get("authToken");
          return token || "";
        },
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
        },
      })
      .configureLogging(signalR.LogLevel.Warning)
      .build();
  }

  return connection;
};
