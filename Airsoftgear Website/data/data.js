const data = {
    "website": "Airsoftgear",
    "categories": [
        { 
            "name" : "Automatic_rifles",
            "image" : "x.jpg",
            "id" : '1',
            "products" : [
                { 
                    "name" : "AK-47", "image" : "images/automatic_rifles/ak47.png"
                },
                { 
                    "name" : "Famas", "image" : "images/automatic_rifles/famas.png"
                },                
                { 
                    "name" : "H&K - G36", "image" : "images/automatic_rifles/H&Kg36.png"
                },
                { 
                    "name" : "M4", "image" : "images/automatic_rifles/m4.png"
                },
                { 
                    "name" : "M16", "image" : "images/automatic_rifles/m16.png"
                }
            ]
        },
        { 
            "name" : "Pistols",
            "image" : "x.jpg",
            "id" : '2',
            "products" : [
                { 
                    "name" : "Beginner", "image" : "images/pistol/basic.png"
                },
                { 
                    "name" : "Desert eagle", "image" : "images/pistol/desert_eagle.png"
                },                
                { 
                    "name" : "Glock 17", "image" : "images/pistol/GLOCK17-min.png"
                },
                { 
                    "name" : "Glock 18", "image" : "images/pistol/Glock18.png"
                },
                { 
                    "name" : "M1911", "image" : "images/pistol/M1911.png"
                }
            ]
        },
        { 
            "name" : "Head_gear",
            "image" : "x.jpg",
            "id" : '3',
            "products" : [
                { 
                    "name" : "Face Mask - winter stripes", "image" : "images/head_gear/winter_camo_mask.png"
                },
                { 
                    "name" : "Facemesh - desert", "image" : "images/head_gear/desert_brown_facemesh.png"
                },                
                { 
                    "name" : "Facemesh - olive green", "image" : "images/head_gear/olive_green_facemesh.png"
                },
                { 
                    "name" : "Tactical helmet - black", "image" : "images/head_gear/tactical_black_helmet.png"
                },
                { 
                    "name" : "Mask - specops black", "image" : "images/head_gear/specops_black_mask.png"
                }
            ]
        },
        { 
            "name" : "Gloves",
            "image" : "x.jpg",
            "id" : '4',
            "products" : [
                { 
                    "name" : "Hand Shield - black", "image" : "images/gloves/HandShield-black.png"
                },
                { 
                    "name" : "Tactical Black", "image" : "images/gloves/TacticalBlack.png"
                },                
                { 
                    "name" : "Light - olive green", "image" : "images/gloves/olive-green.png"
                },
                { 
                    "name" : "Agile black", "image" : "images/gloves/Agile-black.png"
                },
                { 
                    "name" : "Glovelettes - leather", "image" : "images/gloves/Glovelettes-leather.png"
                }
            ]
        },
        { 
            "name" : "Backpacks",
            "image" : "x.jpg",
            "id" : '5',
            "products" : [
                { 
                    "name" : "Military darkgreen", "image" : "images/backpacks/military-darkgreen.png"
                },
                { 
                    "name" : "Military desert", "image" : "images/backpacks/military-desert.png"
                },                
                { 
                    "name" : "Military forrest", "image" : "images/backpacks/military-forrest.png"
                },
                { 
                    "name" : "Military olive", "image" : "images/backpacks/military-olive.png"
                },
                { 
                    "name" : "Millitary savana", "image" : "images/backpacks/military-savana.png"
                }
            ]
        },
        { 
            "name" : "Miscellaneous",
            "image" : "x.jpg",
            "id" : '6',
            "products" : [
                { 
                    "name" : "Binoculars", "image" : "images/misc/binoculars.png"
                },
                { 
                    "name" : "Gun holster", "image" : "images/misc/gun_holster.png"
                },                
                { 
                    "name" : "Night goggles", "image" : "images/misc/night_goggles.png"
                },
                { 
                    "name" : "Action camera", "image" : "images/misc/action_camera.png"
                },
                { 
                    "name" : "Shooting target", "image" : "images/misc/shooting_target.png"
                }
            ]
        },
        { 
            "name" : "Sniper_rifles",
            "image" : "x.jpg",
            "id" : '7',
            "products" : [
                { 
                    "name" : "Barret M82", "image" : "images/sniper_rifle/Barret_M82.png"
                },
                { 
                    "name" : "Dragunov", "image" : "images/sniper_rifle/Dragunov.png"
                },                
                { 
                    "name" : "Lapua magnum", "image" : "images/sniper_rifle/Lapua_magnum.png"
                },
                { 
                    "name" : "SCAR FN", "image" : "images/sniper_rifle/SCAR_FN.png"
                },
                { 
                    "name" : "Sileneced", "image" : "images/sniper_rifle/Silenced_sniper_rifle.png"
                }
            ]
        },
        { 
            "name" : "Tactical_vests",
            "image" : "x.jpg",
            "id" : '8',
            "products" : [
                { 
                    "name" : "Cargo green", "image" : "images/tactical_vests/Cargo_green.png"
                },
                { 
                    "name" : "Desert", "image" : "images/tactical_vests/Desert.png"
                },                
                { 
                    "name" : "Forest", "image" : "images/tactical_vests/Forest.png"
                },
                { 
                    "name" : "Military - forest", "image" : "images/tactical_vests/Military-forrest.png"
                },
                { 
                    "name" : "Olive green", "image" : "images/tactical_vests/Olive_green.png"
                }
            ]
        },
        { 
            "name" : "Tactical_flashlights",
            "image" : "x.jpg",
            "id" : '9',
            "products" : [
                { 
                    "name" : "Gun mounted", "image" : "images/tactical_flashlight/Gun-mounted.png"
                },
                { 
                    "name" : "Short black", "image" : "images/tactical_flashlight/Hand-black-short.png"
                },                
                { 
                    "name" : "Medium black", "image" : "images/tactical_flashlight/Hand-black.png"
                },
                { 
                    "name" : "Large black", "image" : "images/tactical_flashlight/large.png"
                },
                { 
                    "name" : "Mini", "image" : "images/tactical_flashlight/mini.png"
                }
            ]
        },
        { 
            "name" : "Throwables",
            "image" : "x.jpg",
            "id" : '10',
            "products" : [
                { 
                    "name" : "Frag", "image" : "images/throwable/fraggranade.png"
                },
                { 
                    "name" : "Granade Type 1", "image" : "images/throwable/granade-black.png"
                },                
                { 
                    "name" : "Granade", "image" : "images/throwable/granade.png"
                },
                { 
                    "name" : "Smokegranade Type 1", "image" : "images/throwable/smokegranadecustom.png"
                },
                { 
                    "name" : "M83 smoke granade", "image" : "images/throwable/smokegranadeM83.png"
                }
            ]
        }
    ]
};

module.exports = data;