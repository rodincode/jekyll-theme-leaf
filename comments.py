

from firebase import firebase
 
 
firebase = firebase.FirebaseApplication('URL of Database', None)
data =  { 'Name': 'John Doe',
          'RollNo': 3,
          'Percentage': 70.02
          }
result = firebase.post('/python-example-f6d0b/Students/',data)
print(result)
