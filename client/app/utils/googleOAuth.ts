export const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();
    if ((window as any).google?.accounts?.oauth2) {
      return resolve();
    }
    const existingScript = document.getElementById("google-gsi-script");
    if (existingScript) {
      if ((window as any).google?.accounts?.oauth2) {
        return resolve();
      }
      existingScript.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.id = "google-gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
};

export const getGoogleClientId = (): string => {
  if (typeof window === "undefined") return "";
  return (
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    localStorage.getItem("google_client_id") ||
    ""
  );
};

export const setGoogleClientId = (clientId: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("google_client_id", clientId.trim());
  }
};

export const requestGoogleAccessToken = async (
  clientId: string,
  onSuccess: (googleUser: { email: string; name: string; picture: string }) => void,
  onError: (error: any) => void
): Promise<void> => {
  await loadGoogleScript();

  if (!(window as any).google?.accounts?.oauth2) {
    onError(
      new Error(
        "Google Identity Services failed to load. Please check your internet connection."
      )
    );
    return;
  }

  try {
    const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: clientId.trim(),
      scope:
        "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
      callback: async (tokenResponse: any) => {
        if (tokenResponse.error) {
          onError(tokenResponse);
          return;
        }
        try {
          const userInfoRes = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            }
          );
          const googleUser = await userInfoRes.json();
          if (!googleUser.email) {
            throw new Error("Unable to retrieve email from Google profile");
          }
          onSuccess({
            email: googleUser.email,
            name: googleUser.name || googleUser.email.split("@")[0],
            picture: googleUser.picture || "",
          });
        } catch (err) {
          onError(err);
        }
      },
      error_callback: (error: any) => {
        onError(error);
      },
    });

    tokenClient.requestAccessToken({ prompt: "select_account" });
  } catch (err) {
    onError(err);
  }
};
