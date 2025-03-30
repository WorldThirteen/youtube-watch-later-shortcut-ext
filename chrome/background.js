function executeYouTubeCommand(action) {
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

  const sendActionToNativeYouTubeHandler = (getParams) => {
    const location = new URL(window.location.href);
    const appElement = document.querySelector("ytd-app");
    let videoId = location.searchParams.get("v");

    if (location.pathname.startsWith("/shorts/")) {
      videoId = location.pathname.split("/")[2];
    }

    if (!videoId || !appElement) {
      return;
    }
  
    const event = new window.CustomEvent('yt-action', {
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
    if (action === "add-to-watch-later") {
      sendActionToNativeYouTubeHandler(getAddVideoParams);
    }
    if (action === "remove-from-watch-later") {
      sendActionToNativeYouTubeHandler(getRemoveVideoParams);
    }
  } catch (error) {
    console.warn("Error while sending message to native YouTube handler", error);
  }
}

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "add-to-watch-later" || command === "remove-from-watch-later") {
    const [activeYouTubeTab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
      url: 'https://www.youtube.com/*',
    });

    if (!activeYouTubeTab) {
      return;
    }

    await chrome.scripting.executeScript({
      target: {
        tabId: activeYouTubeTab.id,
      },
      func: executeYouTubeCommand,
      args: [command],
    });
  }
});
