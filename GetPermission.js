const rolePermissions = {
    AD: {
     homePage: {
      CompPack : true,
      Manual: true,
      UserManage: true,
      RXQ: true,
      PBI: true,
     },
     SnapPage: {
      patientEdit: true,
      addNotes: true,
      timeslotsEdit: true,
      Reviewed: true,
      Notepin: true,
     },
     MediList: {
      packEdit: true,
      reviewEdit: true,
      canDelete: true,
      canEdit: true,
      canADD: true,
      nonPackYes: true,
     },
     importPage: {
      canExport: true,
     },
     importAllPage: {
      canExport: true,
     },
     PDFPrint: {
      canPrint: true,
     }
    },
    TCN: {
      homePage: {
        CompPack : true,
        Manual: true,
        UserManage: false,
        RXQ: false,
        PBI: false,
       },
       SnapPage: {
        patientEdit: true,
        addNotes: true,
        timeslotsEdit: false,
        Reviewed: false,
        Notepin: true,
       },
       MediList: {
        packEdit: false,
        reviewEdit: false,
        canDelete: false,
        canEdit: false,
        canADD: false,
        nonPackYes: true,
       },
       importPage: {
        canExport: false,
       },
       importAllPage: {
        canExport: false,
       },
       PDFPrint: {
        canPrint: true,
       }
    },
    PH: {
      homePage: {
        CompPack : true,
        Manual: true,
        UserManage: false,
        RXQ: false,
        PBI: false,
       },
       SnapPage: {
        patientEdit: true,
        addNotes: true,
        timeslotsEdit: false,
        Reviewed: false,
        Notepin: true,
       },
       MediList: {
        packEdit: false,
        reviewEdit: true,
        canDelete: true,
        canEdit: true,
        canADD: true,
        nonPackYes: false,
       },
       importPage: {
        canExport: true,
       },
       importAllPage: {
        canExport: true,
       },
       PDFPrint: {
        canPrint: true,
       }
    },
    ITN: {
      homePage: {
        CompPack : true,
        Manual: true,
        UserManage: false,
        RXQ: false,
        PBI: false,
       },
       SnapPage: {
        patientEdit: true,
        addNotes: true,
        timeslotsEdit: true,
        Reviewed: false,
        Notepin: true,
       },
       MediList: {
        packEdit: true,
        reviewEdit: true,
        canDelete: true,
        canEdit: true,
        canADD: true,
        nonPackYes: true,
       },
       importPage: {
        canExport: true,
       },
       importAllPage: {
        canExport: true,
       },
       PDFPrint: {
        canPrint: true,
       }
    },
    PD: {
      homePage: {
        CompPack : true,
        Manual: false,
        UserManage: false,
        RXQ: false,
        PBI: false,
       },
       SnapPage: {
        patientEdit: false,
        addNotes: false,
        timeslotsEdit: false,
        Reviewed: false,
        Notepin: false,
       },
       MediList: {
        packEdit: false,
        reviewEdit: false,
        canDelete: false,
        canEdit: false,
        canADD: false,
        nonPackYes: true,
       },
       importPage: {
        canExport: false,
       },
       importAllPage: {
        canExport: false,
       },
       PDFPrint: {
        canPrint: true,
       }
    },
    PPH: {
      homePage: {
        CompPack : true,
        Manual: true,
        UserManage: false,
        RXQ: false,
        PBI: false,
       },
       SnapPage: {
        patientEdit: true,
        addNotes: true,
        timeslotsEdit: true,
        Reviewed: true,
        Notepin: true,
       },
       MediList: {
        packEdit: true,
        reviewEdit: true,
        canDelete: true,
        canEdit: true,
        canADD: true,
        nonPackYes: true,
       },
       importPage: {
        canExport: true,
       },
       importAllPage: {
        canExport: true,
       },
       PDFPrint: {
        canPrint: true,
       }
    },
  };
  export const getPermissionsByRole = (role) => {
    return rolePermissions[role] || {};
  };
  