
const express = require('express');
const router = express.Router();

const db = require("../db");
const dbName = "data";
const profileCollection = "profile";

/* PROFILES */
function getImageUrl() {
    var urls = [
        'https://lh3.googleusercontent.com/jdJBXOtV_W5-_6MNQdZS94OTioGUmzG_ev31hAqr8SSvdmfaZpI_oDsUF2HGTgYfpc7CH4GMzErPgHlVtp-b7bPIyUXKJvwG5QqsvDZhhGFnrUjnr2aaDW0zFz-Mf_iuTTGV9sovjJzNgt8pdfkrMY07K_CaWi-Gkv4pUO46E6I_gMx-8uQIPnr3qbfr5QgGJnylp9VCC-fQKbz8suzIJRHFP8a9fYlzyMYyEhcq5qqbQl_wY-e428VYuIbJyLWhvlQaoXHZdqE7ly_U95qLBt4pbRJizIBj7miVkTr5SrcdsjOQhYUD0wp7Q01CmRCjbIBMBBzdniRdUv-qqJMMBa001kf4DLfONeyY4mDu8vdg2Loms_Lmw2wOAJ_oHQU2sl9LRvZL2bQEJ9OnnYzX7qku7pxInU1cWCdFeAY4-M9W3ThCF_FoScixSl2iDo1z60NvOyUhwSvFcM4ZJofZEtBTCfC7rAqkgP09q8LnBAfNc2IolFF5j_l0aOCoAffH9IhG-Y4C-_m8yv6p0i4qzes7_fIRrV0jVCMTdfv3pdrnDUfstsJ4nMgtNAPvGX8HjJReLcvUSETTJX-rBjNkQZ_Rg1jdZpxbzf46wBtrRjxr0IlEGkMjl9bHqBciJFFPqGiuI_3bquNSmW1qBJeBqI3dfMHZzdXQYFtyXh_pkz244BiDRQxDjwOmGigIYP0=s625-no?authuser=0',
        'https://lh3.googleusercontent.com/JDzz_dIS9SqhWQZA9WFRshaTSiJIAe-rgyjNq2ZQmLKFHlaACUVBIBKX6mNs4iX5U4h8cb85lcYpqXJnRoIZedd7BRGZqsAEW5_zFw2QO3cUO1MTGcwJIMyKfjjav5Ok3xnXbgEvSYWuDrSI8_NHWDqgtcK9eFvNQnsZL8FoqjD8Pcn-EL2cUMI64J7ivzP4x2g80varF0zJL9rh6pV_Rk0cv0bu6Ek17aoStOBPjHdAPqplW0X89caB6-hvQ830ZadR2hDxNXsUz0u3z3G_7OcI204Cz-JQmHAwWmQVQDst_PBlVd7sr4RfElmQqsHLk4ksXRUJ1TB1tQQKAriMoIbp1UO3DKw_Zxo9lwSTFc2qM2Esz0QYkgP_-TaEILuKyHe_cZvgxfkXPCuGd9XaMCBx_E2qCJvApRRltEY_k_sC42Lth-qoW_tgSd42BC6cTYiUJ-FKtHuTJR8ZQiQXOM74HwAgZqrECldBRMcwjUf5Px8MZlks2It-H-5Pr2OolI_fdZHDpDMYO2EUCDtRnoPoeUt0u3R0MRwerA7XWCK8vbc9EHEbsxJ5LVIOKNNzwrJpCq2HXHLtKb5BNw5cOdN1lvIR7cIVCxnvgRbyo6LngcodLOYTtvP3a8q15ErRiV6egIdXXwRKjSaDxLHdZInN1putHnmjsxgq87i_LJcHIupknmLOpcDve4BDpLk=s625-no?authuser=0',
        'https://lh3.googleusercontent.com/UwexXnPY0K-DmKsFvHW_yMokJF_7DTnQl0WuMXRCtFFi-9Jd93Gn6THib_ztRAYtAgIRiFVnOOJWHxeHVPtrZRxMluxenJdCAc9c1znVbcKF_mL2OkZPGifnxrYMMMrqomHqn8zdOuLztJu2N-TGMKqBWQ8BZjAEOvOQglGcfhq8BpIuX3O-7ITzt9YuMuQHW93B91GA2q8h12IdtUAjhPJSbqlHyis78o2yI7Kjy8ikRvqflM8TTqCgw5fN2xDrAWP8TtSa-LBgkW2WajLlmjh6mSVNmMCwBoc4fcsKPLzclFsFBF6tdyeQqlKAVq9AgphmW7Qs4GaJnClLd80DVpilpXQeanzHPLsFGq6cPRnfCyAFOTNmYqYraqgAkucYRuDQYLqt9JXiL436Nf5jl1wfIyJSvDhrqgCYGtN9WQyeBi7O-CdWA6NxSo_I8M4sGTKjLwuQlqkGk5iafBFIJZxjI4Av1qpkrYYhQBhlmGH_7Dhi5GiSgsxfnoq-esLKXMv_h7oWktSaL16uYWb4PvPyveSYYcg2jvWtUePzUcZav9JWgWp-z1SrNIAsHec-hRjfdJKiyPD2ghA_ZFybrxQukYG2E0IjRqDTAa_C2aPghNBWPYJ1ghf-G9zrtMGFLhGmKAAx-6WRoukeeVRpzTyjMXEcFecfHUgDnr7JTHnQFi1c8nXSZRkvOo-u8Qk=s625-no?authuser=0',
        'https://lh3.googleusercontent.com/LpWfbFt1CeW6hcM_G5fj-sfrWgylliUTZY0sp0FSGtjjtrNsV2FRzjYSU7DJOxU3FVMZgrJvpW_qbhwMmcEFG1oAFheOaYoh7bzK-cmB1dw62thT_dTGfd4qYD1H9NJBCjQ8cdkhvQDBllez4ZE9R1VmZZIeR7Jyi3w7kaE-KBq15EP93Zu4zLRq50mlp9kUjxdHkAeG8q5J6judtWrEkxsKsxK5xYPtuNoxRO7-g486yM5jfkzg6D5jH-qTt9WQcVpA916tGjVu54CvQVBY1YouOOq4uREYSLaVf8XL9gW2lKDT5YLMN8yn1J4rm-2FKhJfe5P4GihFwvkYodjqQfkT4vIfQccbg6i16naF51mb49op_cAzKnhsdBVRtzRhLENz3mYiun8EPh-iqdUOYeP6NBGsYj-ZkdOXaecbqCA1zwfgO29VMysPdg4qVam5KNYIIzehiCEoV_5wxoTOYVLbs6BYscBB7Qbj9jG-gbDm5G9TvcW3NIc99abUnb1a4FnbSwHdcdRTrE7U5qggJ5LH9MkYLMS0-toQxtBy3mImKFaJ1d9vj9flhxHveSphJSsp5VkH330nwYlWMqT_OP9HWiphS7pXHoZP7CtByWdwTNgvRxfy5N4zCvo79rMSLpXndLXjmIqtzPKAyZ4_Ls1k_yMBwQ2kx-aBqYdBA72QDYVy_poA59_5iZ0YniQ=s625-no?authuser=0',
        'https://lh3.googleusercontent.com/GkArQVFqMGt6qn1eF57ZqnlCvMxUBClymCjJP0u8bAVT8vFxrQfqhAvCUrHjAgo5uMjcrIL9CpR5H3PLlJUXXjeTHbo4jxC7-sRdL7exFjjyTs3-uhPFv3At4Of0fWg82ubtOFRRBSsVk50IsRyI8tj_Jaj05-Hf6Rq6ByAE80w1EghovvT1MS-fn9srA5T42qwboG1gmht1kGfstFnXXob73hAnGRjZ8erlZCn_wn8L1H0oOg_9q-pzN_z5A8-yWvzcbM5yip0Cy6urmBDeaWwDha0NkA3rn5Pe97EcDruN7xkThjsbgB_5KITdTaztyAVgOXk8tOveJHHijURf4zqHCvNg2Ou3RGzCmRwAHjNnreGY-kGW4JS3A5PmwkbEUSGRFONN0szQTKVNQWIV5qwy8f0zSu9MfceOF601LZ2GltOPCzCp8H_n9pryN_49EndzzNoUnKQGJlExvTWPVwScHMP6z8MxEBPGT5YDhvmbfyaPVT1o6ubcp7-gh7NKOB8hFguIs6TQIvSu7DLmn5VeBwEhUtaIu_rp3XwafTGPwSNmTg1dF7TlpmA5ZHlSvi93VUcjqz9T2IKiiUJgg5E4TMbhtvnIhDhkKVKkNtWneXDz5dxB52sFCPYJHEU237dMTt73u8d8bBqk4DnxbphS1iE9naO6U9DcuyAx4nV7nYBHJmfR9qNUsCln4l8=s625-no?authuser=0'
    ];
    return urls[Math.floor(Math.random() * urls.length)];
}

db.initialize(dbName, profileCollection, function(dbCollection) {
    dbCollection.find().toArray(function(err, result) {
        if (err) throw err;
          //console.log(result);
    });

    // generate room: after POST room, pass in userId, roomId, and true
    // join room: after PUT room, pass in userId and roomId
    router.post("/profiles/:userId/:roomId/:isHost?", (req, res) => {
        const userId = req.params.userId;
        const roomId = req.params.roomId;
        const isHost = false || req.params.isHost;

        const profile = {
            "userId": userId,
            "roomId": roomId,
            "pref": [],
            "isHost": isHost,
            "imgUrl": getImageUrl()
        }

        dbCollection.insertOne(profile, (error, result) => {
            if (error) throw error;
            res.status(201).send(profile)
        });
    });

    router.put("/profiles/:userId/:roomId/", (req, res) => {
        const roomId = req.params.roomId;
        const userId = req.params.userId;
        const pref = req.body.pref;

        dbCollection.updateOne(
            { userId: userId, roomId: roomId },
            { $set: { "pref": pref } },
            (error, result) => {
            if (error) throw error;
            // return item
            res.json(result);
        });
    });

    // DEBUG, see all profiles
    router.get("/profiles", (req, res) => {
        // return updated list
        dbCollection.find().toArray((error, result) => {
            if (error) throw error;
            res.json(result);
        });
    });
}, function(err) {
    throw (err);
});

module.exports = router;
