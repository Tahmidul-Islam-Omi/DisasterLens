from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from app.db.database import get_database


async def ensure_seed_data() -> None:
    db = get_database()
    await _seed_volunteers(db)
    await _seed_tasks(db)
    await _seed_members(db)
    await _seed_community_responses(db)
    await _seed_weather_alerts(db)
    await _seed_incidents(db)
    await _seed_queries(db)
    await _seed_district_weather(db)
    await _seed_missing_persons(db)
    await _seed_villages(db)
    await _seed_village_status(db)
    await _seed_silent_communities(db)
    await _seed_alert_timeline(db)


async def _seed_volunteers(db) -> None:
    col = db["volunteers"]
    if await col.count_documents({}) > 0:
        return

    now = datetime.now(timezone.utc)
    volunteers = [
        {
            "_id": str(uuid4()),
            "name": "Ahmed Ali",
            "nameBn": "আহমেদ আলী",
            "phone": "+880 1712-345678",
            "assignedArea": "Sylhet Sadar",
            "assignedAreaBn": "সিলেট সদর",
            "status": "active",
            "tasksCompleted": 12,
            "created_at": now,
            "updated_at": now,
        },
        {
            "_id": str(uuid4()),
            "name": "Fatima Rahman",
            "nameBn": "ফাতিমা রহমান",
            "phone": "+880 1823-456789",
            "assignedArea": "Netrokona",
            "assignedAreaBn": "নেত্রকোনা",
            "status": "available",
            "tasksCompleted": 8,
            "created_at": now,
            "updated_at": now,
        },
    ]
    await col.insert_many(volunteers)


async def _seed_tasks(db) -> None:
    col = db["tasks"]
    if await col.count_documents({}) > 0:
        return

    now = datetime.now(timezone.utc)
    tasks = [
        {
            "_id": str(uuid4()),
            "title": "Distribute Water Kits in Sector 4",
            "titleBn": "সেক্টর ৪ এ পানির কিট বিতরণ",
            "type": "Relief",
            "typeBn": "ত্রাণ",
            "priority": "high",
            "location": "Sector 4",
            "locationBn": "সেক্টর ৪",
            "assignedTo": ["Ahmed Ali"],
            "assignedToBn": ["আহমেদ আলী"],
            "status": "assigned",
            "progress": 45,
            "deadline": "By 12:00 PM",
            "deadlineBn": "দুপুর ১২:০০ টার মধ্যে",
            "description": "Distribute relief water kits to affected households.",
            "startTime": "09:00",
            "equipmentNeeded": ["water-kits"],
            "created_at": now,
            "updated_at": now,
        },
        {
            "_id": str(uuid4()),
            "title": "Medical Supply Drop at Camp Alpha",
            "titleBn": "ক্যাম্প আলফায় চিকিৎসা সামগ্রী সরবরাহ",
            "type": "Medical",
            "typeBn": "চিকিৎসা",
            "priority": "critical",
            "location": "Camp Alpha",
            "locationBn": "ক্যাম্প আলফা",
            "assignedTo": ["Fatima Rahman"],
            "assignedToBn": ["ফাতিমা রহমান"],
            "status": "pending",
            "progress": 0,
            "deadline": "By 6:00 PM",
            "deadlineBn": "সন্ধ্যা ৬:০০ টার মধ্যে",
            "description": "Deliver emergency medicine to camp.",
            "startTime": "14:00",
            "equipmentNeeded": ["medical-kits"],
            "created_at": now,
            "updated_at": now,
        },
    ]
    await col.insert_many(tasks)


async def _seed_members(db) -> None:
    col = db["members"]
    if await col.count_documents({}) > 0:
        return

    members = [
        {
            "_id": "M001",
            "name": "Rahim Uddin",
            "nameBn": "রহিম উদ্দিন",
            "age": 42,
            "gender": "Male",
            "genderBn": "পুরুষ",
            "village": "Dakshin Para",
            "villageBn": "দক্ষিণ পাড়া",
            "phone": "+8801700000001",
            "household": "HH-101",
        },
        {
            "_id": "M002",
            "name": "Ayesha Begum",
            "nameBn": "আয়েশা বেগম",
            "age": 34,
            "gender": "Female",
            "genderBn": "মহিলা",
            "village": "Madhya Gram",
            "villageBn": "মধ্য গ্রাম",
            "phone": "+8801700000002",
            "household": "HH-102",
        },
    ]
    await col.insert_many(members)


async def _seed_community_responses(db) -> None:
    col = db["community_responses"]
    if await col.count_documents({}) > 0:
        return

    rows: list[dict[str, Any]] = [
        {
            "_id": str(uuid4()),
            "name": "Rahim Uddin",
            "nameBn": "রহিম উদ্দিন",
            "village": "Dakshin Para",
            "villageBn": "দক্ষিণ পাড়া",
            "phone": "+8801700000001",
            "status": "safe",
            "lastResponse": "10 mins ago",
            "lastResponseBn": "১০ মিনিট আগে",
        },
        {
            "_id": str(uuid4()),
            "name": "Ayesha Begum",
            "nameBn": "আয়েশা বেগম",
            "village": "Madhya Gram",
            "villageBn": "মধ্য গ্রাম",
            "phone": "+8801700000002",
            "status": "help",
            "lastResponse": "25 mins ago",
            "lastResponseBn": "২৫ মিনিট আগে",
        },
    ]
    await col.insert_many(rows)


async def _seed_weather_alerts(db) -> None:
    col = db["weather_alerts"]
    if await col.count_documents({}) > 0:
        return

    rows = [
        {
            "_id": "WA001",
            "headline": "Heavy Rainfall Warning",
            "headlineBn": "ভারী বৃষ্টিপাতের সতর্কতা",
            "description": "Intense rainfall expected across northern districts. Flooding likely in low-lying areas.",
            "descriptionBn": "উত্তরাঞ্চলীয় জেলাগুলিতে তীব্র বৃষ্টিপাতের প্রত্যাশা। নিচু এলাকায় বন্যার সম্ভাবনা।",
            "severity": "warning",
            "category": "Heavy Rainfall",
            "categoryBn": "ভারী বৃষ্টিপাত",
            "region": "Northern Bangladesh",
            "regionBn": "উত্তর বাংলাদেশ",
            "timeIssued": "2 hours ago",
            "timeIssuedBn": "২ ঘণ্টা আগে",
            "status": "active",
            "publishedDate": "2024-01-15",
        },
        {
            "_id": "WA002",
            "headline": "Cyclone Alert",
            "headlineBn": "ঘূর্ণিঝড় সতর্কতা",
            "description": "Tropical cyclone approaching coastal regions. Evacuations recommended.",
            "descriptionBn": "উপকূলীয় অঞ্চলে ক্রান্তীয় ঘূর্ণিঝড় আসছে। সরিয়ে নেওয়ার সুপারিশ করা হয়েছে।",
            "severity": "emergency",
            "category": "Cyclone Warning",
            "categoryBn": "ঘূর্ণিঝড় সতর্কতা",
            "region": "Coastal Areas",
            "regionBn": "উপকূলীয় এলাকা",
            "timeIssued": "30 minutes ago",
            "timeIssuedBn": "৩০ মিনিট আগে",
            "status": "active",
            "publishedDate": "2024-01-15",
        },
    ]
    await col.insert_many(rows)


async def _seed_incidents(db) -> None:
    col = db["incidents"]
    if await col.count_documents({}) > 0:
        return

    rows = [
        {
            "_id": "INC001",
            "type": "Flood Level",
            "typeBn": "বন্যার স্তর",
            "location": "Sylhet Sadar",
            "locationBn": "সিলেট সদর",
            "district": "Sylhet",
            "districtBn": "সিলেট",
            "timeReported": "15 mins ago",
            "timeReportedBn": "১৫ মিনিট আগে",
            "source": "Field Report",
            "sourceBn": "মাঠ প্রতিবেদন",
            "verified": True,
            "status": "investigating",
            "details": "Water level rising rapidly in low-lying areas",
            "detailsBn": "নিচু এলাকায় পানির স্তর দ্রুত বৃদ্ধি পাচ্ছে",
            "severity": "high",
        },
        {
            "_id": "INC002",
            "type": "Infrastructure Damage",
            "typeBn": "অবকাঠামো ক্ষতি",
            "location": "Netrokona",
            "locationBn": "নেত্রকোনা",
            "district": "Netrokona",
            "districtBn": "নেত্রকোনা",
            "timeReported": "1 hour ago",
            "timeReportedBn": "১ ঘণ্টা আগে",
            "source": "Volunteer Report",
            "sourceBn": "স্বেচ্ছাসেবক রিপোর্ট",
            "verified": True,
            "status": "active",
            "details": "Bridge partially collapsed, road access limited",
            "detailsBn": "সেতু আংশিকভাবে ভেঙে পড়েছে, রাস্তার প্রবেশাধিকার সীমিত",
            "severity": "critical",
        },
    ]
    await col.insert_many(rows)


async def _seed_queries(db) -> None:
    col = db["queries"]
    if await col.count_documents({}) > 0:
        return

    rows = [
        {
            "_id": "Q001",
            "senderName": "Local Authority - Sylhet",
            "senderNameBn": "স্থানীয় কর্তৃপক্ষ - সিলেট",
            "role": "Local Authority",
            "roleBn": "স্থানীয় কর্তৃপক্ষ",
            "message": "Request for additional relief supplies in Zone A",
            "messageBn": "জোন এ-তে অতিরিক্ত ত্রাণ সরবরাহের অনুরোধ",
            "timeSubmitted": "2 hours ago",
            "timeSubmittedBn": "২ ঘণ্টা আগে",
            "priority": "high",
            "answered": False,
        },
        {
            "_id": "Q002",
            "senderName": "Volunteer - Ahmed Ali",
            "senderNameBn": "স্বেচ্ছাসেবক - আহমেদ আলী",
            "role": "Volunteer",
            "roleBn": "স্বেচ্ছাসেবক",
            "message": "Need medical supplies for flood-affected families",
            "messageBn": "বন্যা-আক্রান্ত পরিবারের জন্য চিকিৎসা সরবরাহ প্রয়োজন",
            "timeSubmitted": "5 hours ago",
            "timeSubmittedBn": "৫ ঘণ্টা আগে",
            "priority": "normal",
            "answered": True,
            "response": "Medical team dispatched to your location",
            "responseBn": "আপনার অবস্থানে চিকিৎসা দল পাঠানো হয়েছে",
        },
    ]
    await col.insert_many(rows)


async def _seed_district_weather(db) -> None:
    col = db["district_weather"]
    if await col.count_documents({}) > 0:
        return

    rows = [
        {
            "_id": "DW001",
            "district": "Dhaka",
            "districtBn": "ঢাকা",
            "division": "Dhaka",
            "divisionBn": "ঢাকা",
            "temperature": 32,
            "rainfall": 45,
            "windSpeed": 28,
            "riskLevel": "moderate",
        },
        {
            "_id": "DW002",
            "district": "Sylhet",
            "districtBn": "সিলেট",
            "division": "Sylhet",
            "divisionBn": "সিলেট",
            "temperature": 28,
            "rainfall": 120,
            "windSpeed": 35,
            "riskLevel": "high",
        },
    ]
    await col.insert_many(rows)


async def _seed_missing_persons(db) -> None:
    col = db["missing_persons"]
    if await col.count_documents({}) > 0:
        return

    rows = [
        {
            "_id": "MP001",
            "name": "Ayesha Begum",
            "nameBn": "আয়েশা বেগম",
            "age": 34,
            "lastSeen": "Sylhet Sadar, Zone A",
            "lastSeenBn": "সিলেট সদর, জোন এ",
            "date": "2023-10-24 14:30",
            "dateBn": "২০২৩-১০-২৪ ১৪:৩০",
            "status": "Possible Match",
            "statusBn": "সম্ভাব্য মিল",
            "score": 94,
            "phone": "+880 1711-000000",
            "img": "https://images.unsplash.com/photo-1705940372495-ab4ed45d3102?w=500&q=80",
        },
        {
            "_id": "MP002",
            "name": "Rina Akhtar",
            "nameBn": "রিনা আখতার",
            "age": 32,
            "lastSeen": "Moulvibazar Route",
            "lastSeenBn": "মৌলভীবাজার রুট",
            "date": "2023-10-22 16:20",
            "dateBn": "২০২৩-১০-২২ ১৬:২০",
            "status": "Possible Match",
            "statusBn": "সম্ভাব্য মিল",
            "score": 71,
            "phone": "+880 1715-444444",
            "img": "https://images.unsplash.com/photo-1561165804-4ec46664a4cb?w=500&q=80",
        },
    ]
    await col.insert_many(rows)


async def _seed_villages(db) -> None:
    col = db["villages"]
    if await col.count_documents({}) > 0:
        return

    rows = [
        {"_id": "dakshin", "nameKey": "village.dakshinPara", "members": 428},
        {"_id": "madhya", "nameKey": "village.madhyaGram", "members": 512},
        {"_id": "char", "nameKey": "village.charJanajat", "members": 345},
        {"_id": "uttar", "nameKey": "village.uttarPara", "members": 398},
    ]
    await col.insert_many(rows)


async def _seed_village_status(db) -> None:
    col = db["village_status"]
    if await col.count_documents({}) > 0:
        return

    rows = [
        {"_id": str(uuid4()), "villageName": "Dakshin Para", "villageNameBn": "দক্ষিণ পাড়া", "safe": 342, "needHelp": 12, "needRescue": 3, "noResponse": 18},
        {"_id": str(uuid4()), "villageName": "Madhya Gram", "villageNameBn": "মধ্য গ্রাম", "safe": 289, "needHelp": 8, "needRescue": 0, "noResponse": 25},
        {"_id": str(uuid4()), "villageName": "Char Janajat", "villageNameBn": "চর জনজাত", "safe": 18, "needHelp": 5, "needRescue": 0, "noResponse": 427},
    ]
    await col.insert_many(rows)


async def _seed_silent_communities(db) -> None:
    col = db["silent_communities"]
    if await col.count_documents({}) > 0:
        return

    rows = [
        {"_id": str(uuid4()), "villageName": "Char Janajat", "villageNameBn": "চর জনজাত", "populationContacted": 450, "responsesReceived": 23},
        {"_id": str(uuid4()), "villageName": "Uttar Para", "villageNameBn": "উত্তর পাড়া", "populationContacted": 320, "responsesReceived": 15},
    ]
    await col.insert_many(rows)


async def _seed_alert_timeline(db) -> None:
    col = db["alert_timeline"]
    if await col.count_documents({}) > 0:
        return

    rows = [
        {
            "_id": str(uuid4()),
            "headline": "Flood risk near Padma river area",
            "headlineBn": "পদ্মা নদী এলাকায় বন্যার ঝুঁকি",
            "description": "Water levels rising rapidly. Residents in low-lying areas should move to higher ground immediately.",
            "descriptionBn": "পানির স্তর দ্রুত বাড়ছে। নিচু এলাকার বাসিন্দাদের অবিলম্বে উঁচু স্থানে যাওয়া উচিত।",
            "timestamp": "10:15 AM",
            "timestampBn": "১০:১৫ AM",
        },
        {
            "_id": str(uuid4()),
            "headline": "Heavy rainfall expected tonight",
            "headlineBn": "আজ রাতে ভারী বৃষ্টিপাতের সম্ভাবনা",
            "description": "Meteorological department forecasts 150mm rainfall. Please stay indoors and avoid travel.",
            "descriptionBn": "আবহাওয়া বিভাগ ১৫০ মিমি বৃষ্টিপাতের পূর্বাভাস দিয়েছে। অনুগ্রহ করে ঘরে থাকুন এবং ভ্রমণ এড়িয়ে চলুন।",
            "timestamp": "6:30 PM",
            "timestampBn": "৬:৩০ PM",
        },
    ]
    await col.insert_many(rows)
