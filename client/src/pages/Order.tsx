import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CheckCircle, Cookie, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { api, ApiError } from '@/lib/api';
import { useAuth, loginWithGoogle } from '@/hooks/use-auth';

// Toggle to enable/disable Google OAuth requirement
const ENABLE_GOOGLE_OAUTH = false; // Set to true to require Google OAuth

const Order = () => {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cookieType: '',
    quantity: '',
    deliveryDate: undefined as Date | undefined,
    customMessage: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cookieTypes = [
    'Chocolate Chip',
    'Oatmeal Raisin',
    'Sugar Cookies',
    'Peanut Butter',
    'Double Chocolate',
    'Snickerdoodle',
    'Shortbread',
    'Gingerbread'
  ];

  useEffect(() => {
    if (!ENABLE_GOOGLE_OAUTH) return; // Skip auth if disabled
    if (!loading && !user) {
      loginWithGoogle();
    } else if (user) {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare order data
      const orderData = {
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        cookieType: formData.cookieType,
        quantity: parseInt(formData.quantity),
        deliveryDate: formData.deliveryDate?.toISOString(),
        customMessage: formData.customMessage || undefined,
        status: 'pending'
      };

      // Call the real API
      await api.createOrder(orderData);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error creating order:', err);
      if (err instanceof ApiError) {
        setError(`Error: ${err.message}`);
      } else {
        setError('Failed to create order. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card className="text-center border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
              <p className="text-lg text-gray-600 mb-6">
                Thank you, {formData.fullName}! Your order for {formData.quantity} {formData.cookieType} cookies has been received.
              </p>
              <p className="text-gray-500 mb-8">
                We'll send a confirmation email to {formData.email} shortly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600">
                  <Link to="/">Back to Home</Link>
                </Button>
                <Button asChild variant="outline" onClick={() => setIsSubmitted(false)}>
                  <Link to="/order">Place Another Order</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/" className="flex items-center text-gray-600 hover:text-pink-500">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="text-center">
            <Cookie className="h-12 w-12 text-pink-500 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Pre-order Cookies</h1>
            <p className="text-lg text-gray-600">Fresh-baked cookies delivered to your door</p>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="border-pink-200 focus:border-pink-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    readOnly={ENABLE_GOOGLE_OAUTH}
                    onChange={e => !ENABLE_GOOGLE_OAUTH && handleInputChange('email', e.target.value)}
                    className={`border-pink-200 focus:border-pink-500 ${ENABLE_GOOGLE_OAUTH ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="border-pink-200 focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cookieType">Cookie Type *</Label>
                  <Select required onValueChange={(value) => handleInputChange('cookieType', value)}>
                    <SelectTrigger className="border-pink-200 focus:border-pink-500">
                      <SelectValue placeholder="Select cookie type" />
                    </SelectTrigger>
                    <SelectContent>
                      {cookieTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (dozens) *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    className="border-pink-200 focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Delivery Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-pink-200 focus:border-pink-500",
                        !formData.deliveryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.deliveryDate ? format(formData.deliveryDate, "PPP") : "Pick a delivery date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.deliveryDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, deliveryDate: date }))}
                      disabled={(date) => {
                        const now = new Date();
                        const minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
                        return date < minDate;
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                <Textarea
                  id="customMessage"
                  placeholder="Any special instructions or messages..."
                  value={formData.customMessage}
                  onChange={(e) => handleInputChange('customMessage', e.target.value)}
                  className="border-pink-200 focus:border-pink-500"
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Order...
                  </div>
                ) : (
                  'Place Order'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Order;
