"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { Controller } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ACCOUNT_FORM_VALIDATION } from "@/constants/accountConstants";

export default function AccountFormDialog({
  control,
  open,
  onOpenChange,
  account,
  onSubmit,
  availableRoles = [],
  campaigns = [],
  positions = [],
  canManageSuperAdmin = false,
  loadingOptions = false,
}) {
  const isEditing = !!account;
  const isSuperAdmin = account?.role === "superadmin";

  // Prevent editing super admin accounts by non-super admins
  useEffect(() => {
    if (isEditing && isSuperAdmin && !canManageSuperAdmin) {
      onOpenChange(false);
    }
  }, [isEditing, isSuperAdmin, canManageSuperAdmin, onOpenChange]);

  // Initialize form with react-hook-form
  const form = useForm({
    defaultValues: {
      email: "", // Added email field
      password: "",
      name: "",
      employeeId: "", // Added employee ID field
      campaign: "", // Added campaign field
      role: "",
    },
  });

  // Update form when account changes
  useEffect(() => {
    if (account) {
      form.reset({
        email: account.email || "",
        // Don't fill password field when editing
        password: "",
        name: account.name || "",
        employeeId: account.employeeId || "", // Include employee ID
        campaign: account.campaign || "",
        role: account.role || "",
      });
    } else {
      form.reset({
        email: "",
        password: "",
        name: "",
        employeeId: "", // Reset employee ID
        campaign: "",
        role: "",
      });
    }
  }, [account, form]);

  // Handle form submission
  const handleSubmit = (data) => {
    // If editing and password is empty, remove it from the data
    if (isEditing && !data.password) {
      const { password, ...restData } = data;
      onSubmit(restData);
    } else {
      onSubmit(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Account" : "Create New Account"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update account details below. Leave password blank to keep unchanged."
              : "Fill in the information below to create a new account."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Employee ID (Ashima ID) Field */}
              <FormField
                control={form.control}
                name="employeeId"
                rules={{
                  required: "Ashima ID is required",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ashima ID</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter Ashima ID"
                        disabled={isEditing} // Employee ID can't be changed when editing
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Address Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter email address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Full Name Field */}
              <FormField
                control={form.control}
                name="name"
                rules={ACCOUNT_FORM_VALIDATION.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter full name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campaign Field */}
              <div className="space-y-2">
                <Label htmlFor="campaign" className="text-sm font-medium">
                  Campaign
                </Label>
                <Controller
                  name="campaign_id"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                      disabled={loadingOptions}
                    >
                      <SelectTrigger 
                        id="campaign"
                        aria-label="Select campaign"
                      >
                        <SelectValue placeholder={
                          loadingOptions ? 'Loading campaigns...' : 'Select campaign'
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {campaigns.length === 0 && !loadingOptions ? (
                          <SelectItem value="no-campaigns" disabled>
                            No campaigns available
                          </SelectItem>
                        ) : (
                          campaigns.map((camp) => (
                            <SelectItem 
                              key={camp.id} 
                              value={camp.id.toString()}
                              title={camp.name}
                            >
                              {camp.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
    
              {/* User Type / Role */}
              <div className="space-y-2">
                <Label htmlFor="user" className="text-sm font-medium">
                  User Type / Role
                </Label>
                <Controller
                  name="role_id"
                  control={control}
                  rules={ACCOUNT_FORM_VALIDATION.role}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                      disabled={loadingOptions}
                    >
                      <SelectTrigger 
                        id="role"
                        aria-label="Select role"
                        className="w-full"
                      >
                        <SelectValue 
                          placeholder={
                            loadingOptions ? 'Loading roles...' : 'Select role'
                          }
                          className="truncate"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                rules={isEditing ? {} : ACCOUNT_FORM_VALIDATION.password}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password {isEditing && "(Leave blank to keep unchanged)"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder={isEditing ? "••••••••" : "Enter password"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update Account" : "Create Account"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}