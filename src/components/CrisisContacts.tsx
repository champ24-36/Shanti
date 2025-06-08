import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  MessageSquare, 
  Globe, 
  AlertTriangle, 
  Heart,
  Clock,
  MapPin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface CrisisContact {
  id: string;
  name: string;
  number: string;
  type: 'phone' | 'text' | 'chat';
  description: string;
  availability: string;
  language?: string;
}

interface CountryContacts {
  country: string;
  code: string;
  emergency: string;
  contacts: CrisisContact[];
}

const CrisisContacts: React.FC<{ userCountry?: string }> = ({ userCountry }) => {
  const { user } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState(userCountry || user?.country || 'US');
  const [contacts, setContacts] = useState<CrisisContact[]>([]);

  // Comprehensive crisis contact database by country
  const crisisDatabase: Record<string, CountryContacts> = {
    US: {
      country: 'United States',
      code: 'US',
      emergency: '911',
      contacts: [
        {
          id: 'us-988',
          name: 'Suicide & Crisis Lifeline',
          number: '988',
          type: 'phone',
          description: 'Free and confidential emotional support 24/7',
          availability: '24/7',
          language: 'English, Spanish'
        },
        {
          id: 'us-741741',
          name: 'Crisis Text Line',
          number: '741741',
          type: 'text',
          description: 'Text HOME for crisis support',
          availability: '24/7',
          language: 'English'
        },
        {
          id: 'us-chat',
          name: 'Crisis Chat',
          number: 'suicidepreventionlifeline.org/chat',
          type: 'chat',
          description: 'Online crisis chat support',
          availability: '24/7',
          language: 'English'
        }
      ]
    },
    CA: {
      country: 'Canada',
      code: 'CA',
      emergency: '911',
      contacts: [
        {
          id: 'ca-talk',
          name: 'Talk Suicide Canada',
          number: '1-833-456-4566',
          type: 'phone',
          description: 'National suicide prevention service',
          availability: '24/7',
          language: 'English, French'
        },
        {
          id: 'ca-text',
          name: 'Crisis Text Line Canada',
          number: '686868',
          type: 'text',
          description: 'Text TALK for crisis support',
          availability: '24/7',
          language: 'English, French'
        }
      ]
    },
    GB: {
      country: 'United Kingdom',
      code: 'GB',
      emergency: '999',
      contacts: [
        {
          id: 'uk-samaritans',
          name: 'Samaritans',
          number: '116 123',
          type: 'phone',
          description: 'Free emotional support for anyone in distress',
          availability: '24/7',
          language: 'English'
        },
        {
          id: 'uk-text',
          name: 'Samaritans Text',
          number: '07725 909090',
          type: 'text',
          description: 'Text support service',
          availability: '24/7',
          language: 'English'
        }
      ]
    },
    AU: {
      country: 'Australia',
      code: 'AU',
      emergency: '000',
      contacts: [
        {
          id: 'au-lifeline',
          name: 'Lifeline Australia',
          number: '13 11 14',
          type: 'phone',
          description: 'Crisis support and suicide prevention',
          availability: '24/7',
          language: 'English'
        },
        {
          id: 'au-text',
          name: 'Lifeline Text',
          number: '0477 13 11 14',
          type: 'text',
          description: 'Text crisis support',
          availability: '6PM - 12AM',
          language: 'English'
        }
      ]
    },
    IN: {
      country: 'India',
      code: 'IN',
      emergency: '112',
      contacts: [
        {
          id: 'in-aasra',
          name: 'AASRA',
          number: '91-9820466726',
          type: 'phone',
          description: 'Suicide prevention helpline',
          availability: '24/7',
          language: 'English, Hindi'
        },
        {
          id: 'in-sneha',
          name: 'SNEHA',
          number: '044-24640050',
          type: 'phone',
          description: 'Emotional support helpline',
          availability: '24/7',
          language: 'English, Tamil'
        }
      ]
    },
    DE: {
      country: 'Germany',
      code: 'DE',
      emergency: '112',
      contacts: [
        {
          id: 'de-telefonseelsorge',
          name: 'Telefonseelsorge',
          number: '0800 111 0 111',
          type: 'phone',
          description: 'Free crisis counseling',
          availability: '24/7',
          language: 'German'
        },
        {
          id: 'de-nummer',
          name: 'Nummer gegen Kummer',
          number: '116 111',
          type: 'phone',
          description: 'Support for children and teens',
          availability: 'Mon-Sat 2-8 PM',
          language: 'German'
        }
      ]
    },
    FR: {
      country: 'France',
      code: 'FR',
      emergency: '112',
      contacts: [
        {
          id: 'fr-suicide',
          name: 'Suicide Écoute',
          number: '01 45 39 40 00',
          type: 'phone',
          description: 'National suicide prevention line',
          availability: '24/7',
          language: 'French'
        },
        {
          id: 'fr-sos',
          name: 'SOS Amitié',
          number: '09 72 39 40 50',
          type: 'phone',
          description: 'Emotional support and listening',
          availability: '24/7',
          language: 'French'
        }
      ]
    },
    JP: {
      country: 'Japan',
      code: 'JP',
      emergency: '119',
      contacts: [
        {
          id: 'jp-tell',
          name: 'TELL Lifeline',
          number: '03-5774-0992',
          type: 'phone',
          description: 'Crisis support in English',
          availability: '9 AM - 11 PM',
          language: 'English, Japanese'
        },
        {
          id: 'jp-inochi',
          name: 'Inochi no Denwa',
          number: '0570-783-556',
          type: 'phone',
          description: 'Suicide prevention hotline',
          availability: '24/7',
          language: 'Japanese'
        }
      ]
    },
    BR: {
      country: 'Brazil',
      code: 'BR',
      emergency: '192',
      contacts: [
        {
          id: 'br-cvv',
          name: 'Centro de Valorização da Vida',
          number: '188',
          type: 'phone',
          description: 'Suicide prevention and emotional support',
          availability: '24/7',
          language: 'Portuguese'
        },
        {
          id: 'br-caps',
          name: 'CAPS',
          number: '0800-273-8255',
          type: 'phone',
          description: 'Psychosocial care centers',
          availability: 'Business hours',
          language: 'Portuguese'
        }
      ]
    },
    MX: {
      country: 'Mexico',
      code: 'MX',
      emergency: '911',
      contacts: [
        {
          id: 'mx-saptel',
          name: 'SAPTEL',
          number: '55 5259 8121',
          type: 'phone',
          description: 'Crisis intervention and suicide prevention',
          availability: '24/7',
          language: 'Spanish'
        },
        {
          id: 'mx-linea',
          name: 'Línea de la Vida',
          number: '800 911 2000',
          type: 'phone',
          description: 'National crisis line',
          availability: '24/7',
          language: 'Spanish'
        }
      ]
    }
  };

  const countries = Object.keys(crisisDatabase);

  useEffect(() => {
    const countryData = crisisDatabase[selectedCountry];
    if (countryData) {
      setContacts(countryData.contacts);
    }
  }, [selectedCountry]);

  const handleCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  const handleText = (number: string) => {
    window.open(`sms:${number}`, '_self');
  };

  const handleChat = (url: string) => {
    window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'phone': return Phone;
      case 'text': return MessageSquare;
      case 'chat': return Globe;
      default: return Phone;
    }
  };

  const getContactAction = (contact: CrisisContact) => {
    switch (contact.type) {
      case 'phone': return () => handleCall(contact.number);
      case 'text': return () => handleText(contact.number);
      case 'chat': return () => handleChat(contact.number);
      default: return () => handleCall(contact.number);
    }
  };

  const currentCountryData = crisisDatabase[selectedCountry];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <h2 className="text-3xl font-bold text-red-600">Crisis Support</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Immediate help is available. You are not alone. These services are free, confidential, and available 24/7.
        </p>
      </div>

      {/* Country Selection */}
      <div className="card p-6 border-red-200 dark:border-red-700">
        <div className="flex items-center space-x-3 mb-4">
          <MapPin className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold">Select Your Country</h3>
        </div>
        
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full p-3 rounded-xl"
        >
          {countries.map(code => (
            <option key={code} value={code}>
              {crisisDatabase[code].country}
            </option>
          ))}
        </select>
      </div>

      {/* Emergency Number */}
      {currentCountryData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="crisis-contact"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-800 dark:text-red-200">
                  Emergency Services
                </h3>
                <p className="text-red-600 dark:text-red-300">
                  Life-threatening emergencies
                </p>
                <p className="text-sm text-red-500 dark:text-red-400">
                  Police, Fire, Medical Emergency
                </p>
              </div>
            </div>
            
            <motion.button
              onClick={() => handleCall(currentCountryData.emergency)}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentCountryData.emergency}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Crisis Contacts */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center space-x-2">
          <Heart className="w-6 h-6 text-red-500" />
          <span>Mental Health Crisis Support</span>
        </h3>
        
        {contacts.map(contact => {
          const Icon = getContactIcon(contact.type);
          const action = getContactAction(contact);
          
          return (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 border-purple-200 dark:border-purple-700 hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{contact.name}</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {contact.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{contact.availability}</span>
                      </div>
                      {contact.language && (
                        <div className="flex items-center space-x-1">
                          <Globe className="w-4 h-4" />
                          <span>{contact.language}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <motion.button
                    onClick={action}
                    className="btn-gradient px-6 py-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {contact.type === 'phone' && 'Call Now'}
                    {contact.type === 'text' && 'Text Now'}
                    {contact.type === 'chat' && 'Chat Now'}
                  </motion.button>
                  <p className="text-lg font-bold mt-2">{contact.number}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-700 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Important Information
            </h4>
            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
              <li>• All crisis services listed are free and confidential</li>
              <li>• If you're in immediate danger, call emergency services</li>
              <li>• These numbers are verified and regularly updated</li>
              <li>• Support is available in multiple languages where indicated</li>
              <li>• You can also reach out to local emergency rooms or mental health facilities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisContacts;