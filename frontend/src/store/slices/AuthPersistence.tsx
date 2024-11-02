import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { rehydrateState } from "./authSlice";

export const AuthPersistence = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(rehydrateState());
  }, [dispatch]);

  return null;
};
