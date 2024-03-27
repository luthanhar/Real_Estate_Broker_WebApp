import json
from django.test import RequestFactory, TestCase
from api.models import UserProfile, Property, Order, Support
from rest_framework import status
from api.views import register, login, marketOrder, limitOrder, property_list, property_by_id, buy_orders, sell_orders, funds, watchlist, portfolio, get_user, support
from api.serializers import PropertySerializer
from django.contrib.auth.hashers import make_password

    
class TestProperties(TestCase):

     # GET request to /property returns all properties
    def test_get_all_properties(self):
        # Arrange
        request = RequestFactory().get('/property')
        property = Property.objects.create(name='Test Property', category='Test Category', description='Test Description', image='Test Image', location='Test Location', ltp=100.00)
    
        # Act
        response = property_list(request)
    
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert 'properties' in response.data
        assert len(response.data['properties']) > 0

    # The function returns a valid property object when given a valid id and a GET request.
    def test_valid_property_object(self):
        # Arrange
        id = 1
        request = RequestFactory().get(f'/properties/{id}')
        property = Property.objects.create(id=1, name='Test Property', category='Test Category', description='Test Description', image='Test Image', location='Test Location', ltp=100.00)
        serializer = PropertySerializer(property, many=False)
    
        # Act
        response = property_by_id(request, id)
    
        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    # The function returns a 404 status code when given an invalid id and a GET request.
    def test_invalid_id_404(self):
        # Arrange
        id = 999
        request = RequestFactory().get(f'/properties/{id}')
    
        # Act
        response = property_by_id(request, id)
    
        # Assert
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # The function returns a 404 status code when given an invalid id and a DELETE request.
    def test_invalid_id_delete_request(self):
        # Arrange
        id = 9999
        request = RequestFactory().delete(f'/properties/{id}')
    
        # Act
        response = property_by_id(request, id)
    
        # Assert
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # The function returns a 400 status code when given invalid data and a PUT request.
    def test_invalid_data_returns_400(self):
        # Arrange
        id = 1
        property = Property.objects.create(id=1, name='Test Property', category='Test Category', description='Test Description', image='Test Image', location='Test Location', ltp=100.00)
        request = RequestFactory().put(f'/properties/{id}')
        request.data = {'name': 'Test Property', 'category': 'Test Category', 'description': 'Test Description', 'image': 'Test Image', 'location': 'Test Location', 'ltp': 'invalid'}

        # Act
        response = property_by_id(request, id)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # The function returns a serialized property object when given valid data and a PUT request.
    def test_valid_property_object(self):
        # Arrange
        id = 1
        request = RequestFactory().get(f'/properties/{id}')
        property = Property.objects.create(id=1, name='Test Property', category='Test Category', description='Test Description', image='Test Image', location='Test Location', ltp=100.00)
        serializer = PropertySerializer(property, many=False)

        # Act
        response = property_by_id(request, id)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    # The function returns a 400 status code when given a PUT request with missing data.
    def test_put_request_with_missing_data(self):
        # Arrange
        id = 1
        request = RequestFactory().put(f'/properties/{id}')
        property = Property.objects.create(id=1, name='Test Property', category='Test Category', description='Test Description', image='Test Image', location='Test Location', ltp=100.00)

        # Act
        response = property_by_id(request, id)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # The function returns a 204 status code when a property object is successfully deleted.
    def test_delete_property_object_successfully(self):
        # Arrange
        id = 1
        request = RequestFactory().delete(f'/properties/{id}')
        property = Property.objects.create(id=1, name='Test Property', category='Test Category', description='Test Description', image='Test Image', location='Test Location', ltp=100.00)

        # Act
        response = property_by_id(request, id)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # The function returns a serialized property object when given a valid id and a GET request.
    def test_valid_property_object(self):
        # Arrange
        id = 1
        request = RequestFactory().get(f'/properties/{id}')
        property = Property.objects.create(id=1, name='Test Property', category='Test Category', description='Test Description', image='Test Image', location='Test Location', ltp=100.00)
        serializer = PropertySerializer(property, many=False)

        # Act
        response = property_by_id(request, id)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    # The function updates and returns a valid property object when given a valid id and a PUT request with valid data.
    def test_valid_property_update(self):
        # Arrange
        id = 1
        request_data = {
        'name': 'Updated Property',
        'category': 'Updated Category',
        'description': 'Updated Description',
        'image': 'Updated Image',
        'location': 'Updated Location',
        'ltp': 200.00
        }
        request = RequestFactory().put(
            f'/properties/{id}',
            data=json.dumps(request_data),
            content_type='application/json'
        )
        property = Property.objects.create(id=1, name='Test Property', category='Test Category', description='Test Description', image='Test Image', location='Test Location', ltp=100.00)
        serializer = PropertySerializer(property, many=False)
        serializer.update(property, request_data)
        # Act
        response = property_by_id(request, id)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    # The function deletes a property object when given a valid id and a DELETE request.
    def test_delete_valid_property_object(self):
        # Arrange
        id = 1
        request = RequestFactory().delete(f'/properties/{id}')
        property = Property.objects.create(id=1, name='Test Property', category='Test Category', description='Test Description', image='Test Image', location='Test Location', ltp=100.00)

        # Act
        response = property_by_id(request, id)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class TestLoginRegister(TestCase):

    # POST request to /register with invalid data returns 400
    def test_post_register_invalid_data_returns_400(self):
        # Arrange
        request = RequestFactory().post('/register', data={'name': 'John', 'username': 'john123', 'email': 'john@example.com', 'phone': '1234567890', 'pan': 'ABCDE1234F'})
    
        # Act
        response = register(request)
    
        # Assert
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    

    # POST request to /register with valid data registers a new user
    def test_register_with_valid_data(self):
        # Arrange
        data = {
            'name': 'John Doe',
            'username': 'johndoe',
            'email': 'johndoe@example.com',
            'phone': '9876543210',
            'pan': 'ABCDE1234F',
            'password': 'password123'
        }
        request = RequestFactory().post('/register', data=data)
    
        # Act
        response = register(request)
    
        # Assert
        assert response.status_code == status.HTTP_201_CREATED
        assert 'message' in response.data
        assert response.data['message'] == 'User registered successfully'

    

    # POST request to /login with valid credentials logs in a user
    def test_login_with_valid_credentials(self):
        # Arrange
        username = 'test_user'
        password = 'test_password'
        UserProfile.objects.create(username=username, password=make_password(password))
        data = {
            'username': username,
            'password': password
        }
        request = RequestFactory().post('/login', data=data)

        # Act
        response = login(request)
    
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert 'message' in response.data
        assert response.data['message'] == 'Login successful'
        assert 'user' in response.data
        assert response.data['user'] == UserProfile.objects.get(username=username).id
    
     # POST request to /login with invalid credentials returns 401
    def test_login_with_invalid_credentials_returns_401(self):
        # Arrange
        request_data = {
            'username': 'invalid_username',
            'password': 'invalid_password'
        }
        request = RequestFactory().post('/login', data=request_data)
    
        # Act
        response = login(request)
    
        # Assert
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data['message'] == 'Invalid username or password'


class TestFunds(TestCase):

    def setUp(self):
        self.user = UserProfile.objects.create(id=1, username='test_user', password=make_password('test_password'), funds=100)

    # GET request to /funds/{id} returns user funds
    def test_get_user_funds(self):
        # Arrange
        user_id = 1
        request = RequestFactory().get(f'/funds/{user_id}')

        # Act
        response = funds(request, user_id)

        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert 'funds' in response.data

    # PUT request to /funds/{id} adds funds to user account
    def test_put_request_adds_funds_to_user_account(self):
        # Arrange
        user_id = 1
        data = {
            'action': 'add',
            'amount': 100
        }
        request = RequestFactory().put(
            f'/funds/{user_id}',
            data=json.dumps(data),
            content_type='application/json'
        )
    
        # Act
        response = funds(request, user_id)
    
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert 'funds' in response.data
        assert response.data['funds'] == 200

    
    # PUT request to /funds/{id} withdraws funds from user account
    def test_put_request_withdraws_funds_from_user_account(self):
        # Arrange
        user_id = 1
        data = {
            'action': 'withdraw',
            'amount': 50
        }
        request = RequestFactory().put(
            f'/funds/{user_id}',
            data=json.dumps(data),
            content_type='application/json'
        )
    
        # Act
        response = funds(request, user_id)
    
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert 'funds' in response.data
        assert response.data['funds'] == 50
    

    # PUT request with excess withdraw amount returns an error message
    def test_put_request_with_excess_withdraw_amount(self):
        # Arrange
        user_id = 1

        data = {
            'action': 'withdraw',
            'amount': 200
        }
        request = RequestFactory().put(
            f'/funds/{user_id}',
            data=json.dumps(data),
            content_type='application/json'
        )

        # Act
        response = funds(request, user_id)

        # Assert
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data
        assert response.data['error'] == 'Insufficient funds'


class TestOrderBook(TestCase):

    # GET request to /orders/buy/{id} returns top 5 buy orders for property with given id
    def test_get_top_5_buy_orders_for_property(self):
        # Arrange
        property_id = 1
        request = RequestFactory().get(f'/orders/buy/{property_id}')

        # Act
        response = buy_orders(request, property_id)

        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) <= 5
        for order in response.data:
            assert order['order_type'] == 'buy'
            assert order['prop'] == property_id

    # GET request to /orders/sell/{id} returns top 5 sell orders for property with given id
    def test_get_top_5_sell_orders_for_property(self):
        # Arrange
        property_id = 1
        request = RequestFactory().get(f'/orders/sell/{property_id}')

        # Act
        response = sell_orders(request, property_id)

        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) <= 5
        for order in response.data:
            assert order['order_type'] == 'sell'
            assert order['prop'] == property_id
    

    # GET request to /orders/buy/{id} with invalid id returns empty list
    def test_get_invalid_buy_orders(self):
        # Arrange
        invalid_id = 9999
        request = RequestFactory().get(f'/orders/buy/{invalid_id}')

        # Act
        response = buy_orders(request, invalid_id)

        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
        assert len(response.data) == 0


    # GET request to /orders/sell/{id} with invalid id returns empty list
    def test_get_sell_orders_with_invalid_id_returns_empty_list(self):
        # Arrange
        invalid_id = 9999
        request = RequestFactory().get(f'/orders/sell/{invalid_id}')

        # Act
        response = sell_orders(request, invalid_id)

        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
        assert len(response.data) == 0

 

class TestUserData(TestCase):

    def setUp(self):
        user = UserProfile.objects.create(id=1, username='test_user', password=make_password('test_password'))

    
    # GET request to /users/{id} returns user with given id
    def test_get_user_returns_user_with_given_id(self):
        # Arrange
        user_id = 1
        request = RequestFactory().get(f'/users/{user_id}')
    
        # Act
        response = get_user(request, user_id)
    
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert 'name' in response.data
        assert 'email' in response.data
        assert 'phone' in response.data
        assert 'funds' in response.data
        assert 'money_invested' in response.data
        assert 'pnl' in response.data
        assert 'portfolio' in response.data
        assert 'watchlist' in response.data
        assert 'pan' in response.data

    # GET request to /users/{id} with invalid id returns 404
    def test_get_user_with_invalid_id_returns_404(self):
        # Arrange
        invalid_id = 9999
        request = RequestFactory().get(f'/users/{invalid_id}')
    
        # Act
        response = get_user(request, invalid_id)
    
        # Assert
        assert response.status_code == status.HTTP_404_NOT_FOUND

    
class TestSupport(TestCase):

    # POST request to /support with valid data sends a message to support
    def test_post_request_to_support_with_valid_data_sends_message_to_support(self):
        # Arrange
        valid_data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'message': 'This is a test support message.',
            # Include any other required fields
        }
        request = RequestFactory().post('/support/', data=valid_data)

        # Act
        response = support(request)

        # Assert
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == {'message': 'Message sent successfully'}
