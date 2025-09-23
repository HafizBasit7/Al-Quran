import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ZakatCalculator = () => {
  const [activeTab, setActiveTab] = useState('calculator');
  const [formData, setFormData] = useState({
    cash: '',
    bankBalance: '',
    gold: '',
    silver: '',
    business: '',
    investments: '',
    debts: '',
  });

  // Current Nisab rates in PKR (approximate)
  const goldNisab = 2650000; // 87.48g gold ≈ PKR 2,650,000
  const silverNisab = 185000; // 612.36g silver ≈ PKR 185,000
  const zakatRate = 0.025; // 2.5%

  const handleInputChange = (field, value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const formatPKR = (amount) => {
    return `₨${amount.toLocaleString('en-US')}`;
  };

  const calculateZakat = () => {
    const cash = parseFloat(formData.cash) || 0;
    const bankBalance = parseFloat(formData.bankBalance) || 0;
    const gold = parseFloat(formData.gold) || 0;
    const silver = parseFloat(formData.silver) || 0;
    const business = parseFloat(formData.business) || 0;
    const investments = parseFloat(formData.investments) || 0;
    const debts = parseFloat(formData.debts) || 0;

    const totalAssets = cash + bankBalance + gold + silver + business + investments;
    const netWorth = totalAssets - debts;

    const isZakatDue = netWorth >= silverNisab;
    const zakatAmount = isZakatDue ? netWorth * zakatRate : 0;

    return {
      totalAssets,
      netWorth,
      isZakatDue,
      zakatAmount,
      nisabDifference: silverNisab - netWorth
    };
  };

  const result = calculateZakat();

  const showZakatInfo = () => {
    Alert.alert(
      'زکوٰۃ کی معلومات',
      'یہ تخمینی حساب ہے۔ براہ کرم کسی عالم سے مشورہ کریں۔',
      [{ text: 'ٹھیک ہے', style: 'default' }]
    );
  };

  const ZakatRulesContent = () => (
    <ScrollView style={styles.rulesContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.ruleCard}>
        <Text style={styles.ruleTitle}>زکوٰۃ کیا ہے؟</Text>
        <Text style={styles.ruleText}>
          زکوٰۃ اسلام کا تیسرا رکن ہے۔ یہ مالدار مسلمانوں پر فرض ہے کہ وہ اپنی دولت کا 2.5% حصہ غریبوں اور ضرورت مندوں کو دیں۔
        </Text>
      </View>

      <View style={[styles.ruleCard, { backgroundColor: '#EBF8FF' }]}>
        <Text style={[styles.ruleTitle, { color: '#2B6CB0' }]}>زکوٰۃ کب فرض ہے؟</Text>
        <Text style={styles.ruleText}>
          • آپ بالغ اور عاقل ہوں{'\n'}
          • آپ کے پاس نصاب برابر مال ہو{'\n'}
          • یہ مال آپ کے پاس پورا سال رہا ہو{'\n'}
          • یہ مال آپ کی بنیادی ضروریات سے زائد ہو
        </Text>
      </View>

      <View style={[styles.ruleCard, { backgroundColor: '#F0FFF4' }]}>
        <Text style={[styles.ruleTitle, { color: '#276749' }]}>نصاب کیا ہے؟</Text>
        <Text style={styles.ruleText}>
          • سونے کا نصاب: 87.48 گرام (تقریباً 26 لاکھ روپے){'\n'}
          • چاندی کا نصاب: 612.36 گرام (تقریباً 1 لاکھ 85 ہزار روپے){'\n\n'}
          نوٹ: اگر آپ کے پاس چاندی کے نصاب کے برابر مال ہے تو زکوٰۃ فرض ہے
        </Text>
      </View>

      <View style={[styles.ruleCard, { backgroundColor: '#FFFAF0' }]}>
        <Text style={[styles.ruleTitle, { color: '#C05621' }]}>کن چیزوں پر زکوٰۃ ہے؟</Text>
        <Text style={styles.ruleText}>
          • نقد رقم (روپے، ڈالر وغیرہ){'\n'}
          • بینک اکاؤنٹ میں رقم{'\n'}
          • سونا چاندی{'\n'}
          • تجارتی سامان{'\n'}
          • حصص (شیئرز){'\n'}
          • قرض جو واپس ملنے کی امید ہو
        </Text>
      </View>

      <View style={[styles.ruleCard, { backgroundColor: '#FEF2F2' }]}>
        <Text style={[styles.ruleTitle, { color: '#B91C1C' }]}>کن چیزوں پر زکوٰۃ نہیں؟</Text>
        <Text style={styles.ruleText}>
          • رہائشی گھر{'\n'}
          • استعمال کی گاڑی{'\n'}
          • گھریلو سامان{'\n'}
          • ذاتی زیورات (معمول کے مطابق){'\n'}
          • کام کے آلات
        </Text>
      </View>

      <View style={[styles.ruleCard, { backgroundColor: '#F0FDFA' }]}>
        <Text style={[styles.ruleTitle, { color: '#134E4A' }]}>زکوٰۃ کون لے سکتا ہے؟</Text>
        <Text style={styles.ruleText}>
          • غریب اور مسکین{'\n'}
          • زکوٰۃ جمع کرنے والے{'\n'}
          • جن کے دل اسلام کی طرف مائل ہوں{'\n'}
          • غلام آزاد کرنے کے لیے{'\n'}
          • قرضدار{'\n'}
          • اللہ کی راہ میں{'\n'}
          • مسافر
        </Text>
      </View>
    </ScrollView>
  );

//   const CalculatorContent = () => (
//     <ScrollView style={styles.calculatorContainer} showsVerticalScrollIndicator={false}>
//       <Text style={styles.sectionTitle}>اپنی تفصیلات درج کریں</Text>
      
//       <View style={styles.inputSection}>
//         <Text style={styles.sectionHeader}>اثاثے (Assets)</Text>
        
//         <View style={styles.inputGroup}>
//           <Text style={styles.inputLabel}>نقد رقم (PKR)</Text>
//           <TextInput
//             style={styles.input}
//             value={formData.cash}
//             onChangeText={(value) => handleInputChange('cash', value)}
//             placeholder="0"
//             keyboardType="numeric"
//             textAlign="right"
//           />
//         </View>

//         <View style={styles.inputGroup}>
//           <Text style={styles.inputLabel}>بینک بیلنس (PKR)</Text>
//           <TextInput
//             style={styles.input}
//             value={formData.bankBalance}
//             onChangeText={(value) => handleInputChange('bankBalance', value)}
//             placeholder="0"
//             keyboardType="numeric"
//             textAlign="right"
//           />
//         </View>

//         <View style={styles.inputGroup}>
//           <Text style={styles.inputLabel}>سونے کی قیمت (PKR)</Text>
//           <TextInput
//             style={styles.input}
//             value={formData.gold}
//             onChangeText={(value) => handleInputChange('gold', value)}
//             placeholder="0"
//             keyboardType="numeric"
//             textAlign="right"
//           />
//         </View>

//         <View style={styles.inputGroup}>
//           <Text style={styles.inputLabel}>چاندی کی قیمت (PKR)</Text>
//           <TextInput
//             style={styles.input}
//             value={formData.silver}
//             onChangeText={(value) => handleInputChange('silver', value)}
//             placeholder="0"
//             keyboardType="numeric"
//             textAlign="right"
//           />
//         </View>

//         <View style={styles.inputGroup}>
//           <Text style={styles.inputLabel}>کاروباری مال (PKR)</Text>
//           <TextInput
//             style={styles.input}
//             value={formData.business}
//             onChangeText={(value) => handleInputChange('business', value)}
//             placeholder="0"
//             keyboardType="numeric"
//             textAlign="right"
//           />
//         </View>

//         <View style={styles.inputGroup}>
//           <Text style={styles.inputLabel}>سرمایہ کاری (PKR)</Text>
//           <TextInput
//             style={styles.input}
//             value={formData.investments}
//             onChangeText={(value) => handleInputChange('investments', value)}
//             placeholder="0"
//             keyboardType="numeric"
//             textAlign="right"
//           />
//         </View>
//       </View>

//       <View style={styles.inputSection}>
//         <Text style={styles.sectionHeader}>منہا کریں (Deductions)</Text>
        
//         <View style={styles.inputGroup}>
//           <Text style={styles.inputLabel}>قرض (PKR)</Text>
//           <TextInput
//             style={styles.input}
//             value={formData.debts}
//             onChangeText={(value) => handleInputChange('debts', value)}
//             placeholder="0"
//             keyboardType="numeric"
//             textAlign="right"
//           />
//         </View>
//       </View>

//       {/* Results Section */}
//       <View style={styles.resultsSection}>
//         <Text style={styles.sectionTitle}>نتیجہ</Text>
        
//         <View style={styles.resultCard}>
//           <View style={styles.resultRow}>
//             <Text style={styles.resultValue}>{formatPKR(result.totalAssets)}</Text>
//             <Text style={styles.resultLabel}>کل اثاثے:</Text>
//           </View>
          
//           <View style={styles.resultRow}>
//             <Text style={styles.resultValue}>{formatPKR(result.netWorth)}</Text>
//             <Text style={styles.resultLabel}>خالص دولت:</Text>
//           </View>
          
//           <View style={[styles.resultRow, { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 10 }]}>
//             <Text style={styles.nisabText}>{formatPKR(silverNisab)}</Text>
//             <Text style={styles.nisabLabel}>نصاب (چاندی):</Text>
//           </View>
//         </View>

//         {result.isZakatDue ? (
//           <View style={[styles.statusCard, { backgroundColor: '#D1FAE5', borderColor: '#10B981' }]}>
//             <Text style={[styles.statusTitle, { color: '#065F46' }]}>✅ آپ پر زکوٰۃ فرض ہے</Text>
//             <View style={styles.zakatAmountContainer}>
//               <Text style={styles.zakatAmount}>{formatPKR(result.zakatAmount)}</Text>
//               <Text style={styles.zakatLabel}>واجب زکوٰۃ کی رقم</Text>
//             </View>
//             <Text style={styles.statusMessage}>
//               یہ رقم غریبوں اور ضرورت مندوں میں تقسیم کریں
//             </Text>
//           </View>
//         ) : (
//           <View style={[styles.statusCard, { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' }]}>
//             <Text style={[styles.statusTitle, { color: '#1E40AF' }]}>ℹ️ آپ پر زکوٰۃ فرض نہیں</Text>
//             <Text style={styles.statusMessage}>
//               آپ کی دولت نصاب سے کم ہے۔ نصاب تک پہنچنے کے لیے{' '}
//               <Text style={styles.amountHighlight}>{formatPKR(Math.abs(result.nisabDifference))}</Text>
//               {' '}اور درکار ہے۔
//             </Text>
//           </View>
//         )}

//         <TouchableOpacity style={styles.infoButton} onPress={showZakatInfo}>
//           <Text style={styles.infoButtonText}>⚠️ اہم معلومات</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#059669" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>EasyQuran</Text>
        <Text style={styles.subtitle}>زکوٰۃ کیلکولیٹر</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'calculator' && styles.activeTab]}
          onPress={() => setActiveTab('calculator')}
        >
          <Text style={[styles.tabText, activeTab === 'calculator' && styles.activeTabText]}>
            کیلکولیٹر
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'rules' && styles.activeTab]}
          onPress={() => setActiveTab('rules')}
        >
          <Text style={[styles.tabText, activeTab === 'rules' && styles.activeTabText]}>
            احکام
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {/* {activeTab === 'calculator' ? <CalculatorContent /> : <ZakatRulesContent />} */}
      <ZakatRulesContent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#059669',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#D1FAE5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 3,
    borderBottomColor: '#059669',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#059669',
    fontWeight: 'bold',
  },
  calculatorContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  rulesContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0FDF4',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'right',
    marginBottom: 20,
  },
  inputSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'right',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    textAlign: 'right',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  resultsSection: {
    marginTop: 10,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'right',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  nisabLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  nisabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 15,
  },
  zakatAmountContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  zakatAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 5,
  },
  zakatLabel: {
    fontSize: 14,
    color: '#047857',
  },
  statusMessage: {
    fontSize: 14,
    textAlign: 'right',
    lineHeight: 20,
  },
  amountHighlight: {
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  infoButton: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  infoButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#92400E',
  },
  ruleCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  ruleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'right',
    marginBottom: 10,
  },
  ruleText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'right',
    lineHeight: 22,
  },
});

export default ZakatCalculator;