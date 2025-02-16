import { handleSessionExpired } from "../redux/user/userSlice";
import { clearCart } from "../redux/cart/cartSlice";

// Remove useDispatch import as we'll pass dispatch as a parameter
export const authenticatedFetch = async (url, options = {}, dispatch) => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (
      response.status === 401 ||
      data.message === "Session expired or invalid. Please login again."
    ) {
      dispatch(handleSessionExpired());
      dispatch(clearCart());
      window.location.href = "/sign-in";
      throw new Error("Session expired");
    }

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    if (error.message === "UNAUTHORIZED") {
      dispatch(handleSessionExpired());
      window.location.href = "/sign-in";
    }
    throw error;
  }
};
