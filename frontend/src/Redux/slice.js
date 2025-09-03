import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  PatientIdentifier: null,
  selectedLibertyRow: null,
  token: sessionStorage.getItem("token") || null,
  tokenname: sessionStorage.getItem("tokenname") || null,
  Role: sessionStorage.getItem("Role") || null,
  RoleDesc: sessionStorage.getItem("RoleDesc") || null,
};

const PatientIdentifierSlice = createSlice({
  name: "PatientIdentifier",
  initialState,
  reducers: {
    setPatientIdentifier(state, action) {
      state.PatientIdentifier = action.payload;
    },

    setlibertyRow(state, action) {
      state.selectedLibertyRow = action.payload;
    },

    settoken(state, action) {
      const { token, tokenname, Role, RoleDesc } = action.payload;
      state.token = token;
      state.tokenname = tokenname;
      state.Role = Role;
      state.RoleDesc = RoleDesc;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("tokenname", tokenname);
      sessionStorage.setItem("Role", Role);
      sessionStorage.setItem("RoleDesc", RoleDesc);
    },
    logout(state) {
      state.token = null;
      state.tokenname = null;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("tokenname");
      sessionStorage.removeItem("RoleDesc");
      localStorage.clear();
    },
  },
});

export const { setPatientIdentifier, setlibertyRow, settoken, logout } =
  PatientIdentifierSlice.actions;
export default PatientIdentifierSlice.reducer;
