from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['faculty_appraisal_db']

users = list(db.users.find({}, {'userId': 1, 'role': 1, 'name': 1, '_id': 0}))
print(f'Total users in database: {len(users)}\n')
print('User ID              Role                      Name')
print('-' * 70)
for u in users:
    print(f"{u['userId']:20s} {u['role']:25s} {u['name']}")
