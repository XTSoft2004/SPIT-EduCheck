import { useEffect, useState } from 'react';
import { Select } from 'antd';
import { refreshToken } from '@/actions/auth.actions';
import { getSemesters } from '@/actions/semester.actions';
import { setSemesterId, getProfile } from '@/actions/user.actions';
import { ISemester } from '@/types/semester';

const { Option } = Select;

const SemesterDropdown = () => {
  const [semesters, setSemesters] = useState<ISemester[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const semesterResponse = await getSemesters();
      if (semesterResponse.ok) {
        setSemesters(semesterResponse.data);
      }

      const profileResponse = await getProfile();
      if (profileResponse.ok) {
        setSelectedSemester(profileResponse.data.semesterId);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSelect = async (semesterId: number) => {
    const response = await setSemesterId(semesterId);
    if (response.status && response.message.includes('thành công')) {
      await refreshToken();
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }
  };

  return (
    <div className="w-full min-w-[247px]">
      <Select
        className="w-full"
        loading={loading}
        value={selectedSemester}
        onChange={handleSelect}
        placeholder="Chọn học kỳ"
      >
        {semesters.map((semester) => (
          <Option key={semester.id} value={semester.id}>
            Học kỳ: {semester.semesters_Number} (Năm học: {semester.yearStart} - {semester.yearEnd})
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default SemesterDropdown;
