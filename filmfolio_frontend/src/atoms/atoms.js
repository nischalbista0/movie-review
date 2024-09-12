// atoms.js
import { atom } from "jotai";

export const userAtom = atom(null);
export const isLoadingAtom = atom(false);
export const isLoggedInAtom = atom(!!localStorage.getItem("token"));
