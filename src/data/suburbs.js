const suburbs = [
    "Abbotsford",
    "Aberfeldie",
    "Airport West",
    "Albanvale",
    "Albert Park",
    "Albion",
    "Alphington",
    "Altona",
    "Altona Meadows",
    "Altona North",
    "Ardeer",
    "Armadale",
    "Arthurs Creek",
    "Arthurs Seat",
    "Ascot Vale",
    "Ashburton",
    "Ashwood",
    "Aspendale",
    "Aspendale Gardens",
    "Attwood",
    "Avondale Heights",
    "Avonsleigh",
    "Badger Creek",
    "Balaclava",
    "Balnarring",
    "Balnarring Beach",
    "Balwyn",
    "Balwyn North",
    "Bangholme",
    "Baxter",
    "Bayles",
    "Bayswater",
    "Bayswater North",
    "Beaconsfield",
    "Beaconsfield Upper",
    "Beaumaris",
    "Beenak",
    "Belgrave",
    "Belgrave Heights",
    "Belgrave South",
    "Bellfield",
    "Bend Of Islands",
    "Bentleigh",
    "Bentleigh East",
    "Berwick",
    "Big Pats Creek",
    "Bittern",
    "Black Rock",
    "Blackburn",
    "Blackburn North",
    "Blackburn South",
    "Blairgowrie",
    "Blind Bight",
    "Bonbeach",
    "Boneo",
    "Boronia",
    "Botanic Ridge",
    "Box Hill",
    "Box Hill North",
    "Box Hill South",
    "Braeside",
    "Braybrook",
    "Briar Hill",
    "Brighton",
    "Brighton East",
    "Broadmeadows",
    "Brookfield",
    "Brooklyn",
    "Brunswick",
    "Brunswick East",
    "Brunswick West",
    "Bulla",
    "Bulleen",
    "Bundoora",
    "Bunyip",
    "Bunyip North",
    "Burnley",
    "Burnside",
    "Burnside Heights",
    "Burwood",
    "Burwood East",
    "Cairnlea",
    "Calder Park",
    "Caldermeade",
    "Cambarville",
    "Camberwell",
    "Campbellfield",
    "Cannons Creek",
    "Canterbury",
    "Cape Schanck",
    "Cardinia",
    "Carlton",
    "Carlton North",
    "Carnegie",
    "Caroline Springs",
    "Carrum",
    "Carrum Downs",
    "Catani",
    "Caulfield",
    "Caulfield East",
    "Caulfield North",
    "Caulfield South",
    "Chadstone",
    "Chelsea",
    "Chelsea Heights",
    "Cheltenham",
    "Chirnside Park",
    "Christmas Hills",
    "Chum Creek",
    "Clarinda",
    "Clayton",
    "Clayton South",
    "Clematis",
    "Clifton Hill",
    "Clyde",
    "Clyde North",
    "Coburg",
    "Coburg North",
    "Cockatoo",
    "Cocoroc",
    "Coldstream",
    "Collingwood",
    "Coolaroo",
    "Cora Lynn",
    "Cottles Bridge",
    "Craigieburn",
    "Cranbourne",
    "Cranbourne East",
    "Cranbourne North",
    "Cranbourne South",
    "Cranbourne West",
    "Cremorne",
    "Crib Point",
    "Croydon",
    "Croydon Hills",
    "Croydon North",
    "Croydon South",
    "Dallas",
    "Dalmore",
    "Dandenong",
    "Dandenong North",
    "Dandenong South",
    "Deepdene",
    "Deer Park",
    "Delahey",
    "Derrimut",
    "Devon Meadows",
    "Dewhurst",
    "Diamond Creek",
    "Diggers Rest",
    "Dingley Village",
    "Dixons Creek",
    "Docklands",
    "Don Valley",
    "Doncaster",
    "Doncaster East",
    "Donnybrook",
    "Donvale",
    "Doreen",
    "Doveton",
    "Dromana",
    "Eaglemont",
    "East Melbourne",
    "East Warburton",
    "Eden Park",
    "Edithvale",
    "Elsternwick",
    "Eltham",
    "Eltham North",
    "Elwood",
    "Emerald",
    "Endeavour Hills",
    "Epping",
    "Essendon",
    "Essendon Fields",
    "Essendon North",
    "Essendon West",
    "Eumemmerring",
    "Exford",
    "Eynesbury",
    "Fairfield",
    "Fawkner",
    "Fernshaw",
    "Ferntree Gully",
    "Ferny Creek",
    "Fingal",
    "Fitzroy",
    "Fitzroy North",
    "Flemington",
    "Flinders",
    "Footscray",
    "Forest Hill",
    "Frankston",
    "Frankston North",
    "Frankston South",
    "Gardenvale",
    "Garfield",
    "Garfield North",
    "Gembrook",
    "Gilderoy",
    "Gladstone Park",
    "Gladysdale",
    "Glen Huntly",
    "Glen Iris",
    "Glen Waverley",
    "Glenroy",
    "Gowanbrae",
    "Greensborough",
    "Greenvale",
    "Gruyere",
    "Guys Hill",
    "Hadfield",
    "Hallam",
    "Hampton",
    "Hampton East",
    "Hampton Park",
    "Harkaway",
    "Hastings",
    "Hawthorn",
    "Hawthorn East",
    "Healesville",
    "Heath Hill",
    "Heatherton",
    "Heathmont",
    "Heidelberg",
    "Heidelberg Heights",
    "Heidelberg West",
    "Highett",
    "Hillside",
    "Hmas Cerberus",
    "Hoddles Creek",
    "Hoppers Crossing",
    "Hughesdale",
    "Humevale",
    "Huntingdale",
    "Hurstbridge",
    "Iona",
    "Ivanhoe",
    "Ivanhoe East",
    "Jacana",
    "Junction Village",
    "Kalkallo",
    "Kallista",
    "Kalorama",
    "Kangaroo Ground",
    "Kealba",
    "Keilor",
    "Keilor Downs",
    "Keilor East",
    "Keilor Lodge",
    "Keilor North",
    "Keilor Park",
    "Kensington",
    "Kew",
    "Kew East",
    "Keysborough",
    "Kilsyth",
    "Kilsyth South",
    "Kinglake West",
    "Kings Park",
    "Kingsbury",
    "Kingsville",
    "Knoxfield",
    "Koo Wee Rup",
    "Koo Wee Rup",
    "Kooyong",
    "Kurunjang",
    "Lalor",
    "Lang Lang",
    "Lang Lang East",
    "Langwarrin",
    "Langwarrin South",
    "Launching Place",
    "Laverton",
    "Laverton North",
    "Lilydale",
    "Lower Plenty",
    "Lynbrook",
    "Lyndhurst",
    "Lysterfield",
    "Lysterfield South",
    "Macclesfield",
    "Macleod",
    "Maidstone",
    "Main Ridge",
    "Malvern",
    "Malvern East",
    "Mambourin",
    "Maribyrnong",
    "Maryknoll",
    "Mccrae",
    "Mckinnon",
    "Mcmahons Creek",
    "Meadow Heights",
    "Melbourne",
    "Melbourne Airport",
    "Melton",
    "Melton South",
    "Melton West",
    "Mentone",
    "Menzies Creek",
    "Mernda",
    "Merricks",
    "Merricks Beach",
    "Merricks North",
    "Mickleham",
    "Middle Park",
    "Mill Park",
    "Millgrove",
    "Mitcham",
    "Modella",
    "Monbulk",
    "Monomeith",
    "Mont Albert",
    "Mont Albert North",
    "Montmorency",
    "Montrose",
    "Moonee Ponds",
    "Moorabbin",
    "Moorabbin Airport",
    "Moorooduc",
    "Mooroolbark",
    "Mordialloc",
    "Mornington",
    "Mount Burnett",
    "Mount Cottrell",
    "Mount Dandenong",
    "Mount Eliza",
    "Mount Evelyn",
    "Mount Martha",
    "Mount Toolebewong",
    "Mount Waverley",
    "Mulgrave",
    "Murrumbeena",
    "Nangana",
    "Nar Nar Goon",
    "Nar Nar Goon",
    "Narre Warren",
    "Narre Warren East",
    "Narre Warren North",
    "Narre Warren South",
    "Newport",
    "Niddrie",
    "Noble Park",
    "Noble Park North",
    //"North",
    //"North",
    "North Melbourne",
    "North Warrandyte",
    "Northcote",
    "Notting Hill",
    "Nunawading",
    "Nutfield",
    "Oak Park",
    "Oaklands Junction",
    "Oakleigh",
    "Oakleigh East",
    "Oakleigh South",
    "Officer",
    "Officer South",
    "Olinda",
    "Ormond",
    "Pakenham",
    "Pakenham South",
    "Pakenham Upper",
    "Panton Hill",
    "Park Orchards",
    "Parkdale",
    "Parkville",
    "Pascoe Vale",
    "Pascoe Vale South",
    "Patterson Lakes",
    "Pearcedale",
    "Plenty",
    "Plumpton",
    "Point Cook",
    "Point Leo",
    "Port Melbourne",
    "Portsea",
    "Powelltown",
    "Prahran",
    "Preston",
    "Princes Hill",
    "Quandong",
    "Ravenhall",
    "Red Hill",
    "Red Hill South",
    "Reefton",
    "Research",
    "Reservoir",
    "Richmond",
    "Ringwood",
    "Ringwood East",
    "Ringwood North",
    "Ripponlea",
    "Rockbank",
    "Rosanna",
    "Rosebud",
    "Rosebud West",
    "Rowville",
    "Roxburgh Park",
    "Rye",
    "Rythdale",
    "Safety Beach",
    "Sandhurst",
    "Sandringham",
    "Sassafras",
    "Scoresby",
    "Seabrook",
    "Seaford",
    "Seaholme",
    "Seddon",
    "Selby",
    "Seville",
    "Seville East",
    "Sherbrooke",
    "Shoreham",
    "Silvan",
    "Skye",
    "Smiths Gully",
    "Somers",
    "Somerton",
    "Somerville",
    "Sorrento",
    "South Kingsville",
    "South Melbourne",
    "South Morang",
    "South Wharf",
    "South Yarra",
    "Southbank",
    "Spotswood",
    "Springvale",
    "Springvale South",
    "St Albans",
    "St Andrews",
    "St Andrews Beach",
    "St Helena",
    "St Kilda",
    "St Kilda East",
    "St Kilda West",
    "Steels Creek",
    "Strathewen",
    "Strathmore",
    "Strathmore Heights",
    "Sunbury",
    "Sunshine",
    "Sunshine North",
    "Sunshine West",
    "Surrey Hills",
    "Sydenham",
    "Tarneit",
    "Tarrawarra",
    "Taylors Hill",
    "Taylors Lakes",
    "Tecoma",
    "Templestowe",
    "Templestowe Lower",
    "The Basin",
    "The Patch",
    "Thomastown",
    "Thornbury",
    "Three Bridges",
    "Tonimbuk",
    "Toolern Vale",
    "Tooradin",
    "Toorak",
    "Tootgarook",
    "Tottenham",
    "Travancore",
    "Tremont",
    "Truganina",
    "Tuerong",
    "Tullamarine",
    "Tyabb",
    "Tynong",
    "Tynong North",
    "Upper Ferntree Gully",
    "Upwey",
    "Vermont",
    "Vermont South",
    "Vervale",
    "Viewbank",
    "Wandin East",
    "Wandin North",
    "Wantirna",
    "Wantirna South",
    "Warburton",
    "Warneet",
    "Warrandyte",
    "Warrandyte South",
    "Warranwood",
    "Waterways",
    "Watsonia",
    "Watsonia North",
    "Watsons Creek",
    "Wattle Glen",
    "Werribee",
    "Werribee South",
    "Wesburn",
    "West Footscray",
    "West Melbourne",
    "Westmeadows",
    "Wheelers Hill",
    "Whittlesea",
    "Wildwood",
    "Williams Landing",
    "Williamstown",
    "Williamstown North",
    "Windsor",
    "Wollert",
    "Wonga Park",
    "Woodstock",
    "Woori Yallock",
    "Wyndham Vale",
    "Yallambie",
    "Yan Yean",
    "Yannathan",
    "Yarra Glen",
    "Yarra Junction",
    "Yarrambat",
    "Yarraville",
    "Yellingbo",
    "Yering",
    "Yuroke"
    ];

    export default suburbs;