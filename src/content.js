const getAddVideoParams = (videoId) => ({
  clickTrackingParams: "",
  commandMetadata: { webCommandMetadata: { sendPost: true, apiUrl: "/youtubei/v1/browse/edit_playlist" } },
  playlistEditEndpoint: { playlistId: "WL", actions: [{ addedVideoId: videoId, action: "ACTION_ADD_VIDEO" }] }
});

const getRemoveVideoParams = (videoId) => ({
  clickTrackingParams: "",
  commandMetadata: { webCommandMetadata: { sendPost: true, apiUrl: "/youtubei/v1/browse/edit_playlist" } },
  playlistEditEndpoint: { playlistId: "WL", actions: [{ action: "ACTION_REMOVE_VIDEO_BY_VIDEO_ID", removedVideoId: videoId }] }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const sendActionToNativeYouTubeHandler = (getParams) => {
    const videoId = new URL(window.location.href).searchParams.get("v");
    const appElement = document.querySelector("ytd-app");

    if (!videoId || !appElement) {
      return;
    }
  
    const event = new CustomEvent('yt-action', {
      detail: {
        actionName: 'yt-service-request',
        returnValue: [],
        args: [{ data: {} }, getParams(videoId)],
        optionalAction: false,
      }
    });
  
    appElement.dispatchEvent(event);
  };

  try {
    if (request.action === "add-to-watch-later") {
      sendActionToNativeYouTubeHandler(getAddVideoParams);
    }
    if (request.action === "remove-from-watch-later") {
      sendActionToNativeYouTubeHandler(getRemoveVideoParams);
    }
  } catch (error) {
    console.warn("Error while sending message to native YouTube handler", error);
  }
});
