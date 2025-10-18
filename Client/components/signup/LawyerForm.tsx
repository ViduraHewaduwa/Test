import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FormInput from './FormInput';
import { RoleFormProps } from '../../types/signup';
import { useTheme } from '../../context/ThemeContext';

interface LawyerFormProps extends RoleFormProps {
  onSpecializationPress: () => void;
}

const LawyerForm: React.FC<LawyerFormProps> = ({
  formData,
  errors,
  updateFormData,
  onSpecializationPress,
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    selectButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.white,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: errors.specialization ? colors.error : colors.border,
    },
    selectButtonText: {
      fontSize: 16,
      color: formData.specialization ? colors.dark : colors.darkgray,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.dark,
      marginBottom: 8,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      marginTop: -12,
      marginBottom: 16,
      marginLeft: 4,
    },
  });

  return (
    <>
      <FormInput
        label="First Name"
        placeholder="Enter your first name"
        value={formData.firstName}
        error={errors.firstName}
        onChangeText={(value) => updateFormData('firstName', value)}
      />
      
      <FormInput
        label="Last Name"
        placeholder="Enter your last name"
        value={formData.lastName}
        error={errors.lastName}
        onChangeText={(value) => updateFormData('lastName', value)}
      />
      
      <View>
        <Text style={styles.label}>Specialization</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={onSpecializationPress}
          activeOpacity={0.7}
        >
          <Text style={styles.selectButtonText}>
            {formData.specialization || 'Select your specialization'}
          </Text>
          <Ionicons 
            name="chevron-down" 
            size={24} 
            color={colors.darkgray} 
          />
        </TouchableOpacity>
        {errors.specialization && (
          <Text style={styles.errorText}>{errors.specialization}</Text>
        )}
      </View>
      
      <FormInput
        label="Contact Number"
        placeholder="Enter your contact number"
        value={formData.contactNumber}
        error={errors.contactNumber}
        onChangeText={(value) => updateFormData('contactNumber', value)}
        keyboardType="phone-pad"
      />
    </>
  );
};

export default LawyerForm;